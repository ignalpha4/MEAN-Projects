import { Request, Response } from "express";
import Game from "../models/game.model";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { moduleType } from "../utils/module.type";
import { verifyToken } from "../middleware/authentication";


@controller('/user',moduleType('user'))
export class gameController {

  constructor() {}

  @httpGet('/games/:gameId',verifyToken)
  async getGameDetails(req: Request, res: Response){
    try {
      const gameId = req.params.gameId;
      const game = await Game.findById(gameId).populate("players");

      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }

      return res.status(200).json({ success: true, game });
    } catch (error: any) {
      console.log(error.message);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error fetching game details",
          error: error.message,
        });
    }
  };


  @httpGet('getAllGameDetails',verifyToken)
  async getAllGameDetails(req: Request, res: Response){
    try {
      const games = await Game.find().populate("players");

      if (!games) {
        return res.json({
          success: false,
          message: "No completed games found",
        });
      }

      return res.json({
        success: true,
        message: "Completed games found",
        games,
      });
    } catch (error: any) {
      console.log(error.message);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error fetching completed games",
          error: error.message,
        });
    }
  };

  @httpPost('/games',verifyToken)
  async  createGame (req: Request, res: Response) {
    try {
      const { size, players } = req.body;

      if (!size || size < 3) {
        return res
          .status(400)
          .json({ success: false, message: "Grid size must be at least 3" });
      }

      if (!players || players.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No player info provided" });
      }

      const grid = Array.from({ length: size }, () => Array(size).fill(null));

      const newGame = new Game({
        size,
        players,
        grid,
        currentPlayerIndex: 0,
        gameStatus: "in-progress",
      });

      await newGame.save();

      return res
        .status(200)
        .json({
          success: true,
          message: "Game created successfully",
          game: newGame,
        });
    } catch (error: any) {
      console.log(error.message);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error creating game",
          error: error.message,
        });
    }
  };

  @httpPost('/games/move',verifyToken)
  async makeMove(req: Request, res: Response){
    try {
      const { gameId, row, col } = req.body;
      const game = await Game.findById(gameId);

      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }

      if (game.grid[row][col] !== null) {
        return res
          .status(400)
          .json({ success: false, message: "Cell already occupied" });
      }

      const currentPlayer = game.players[game.currentPlayerIndex];
      game.grid[row][col] = currentPlayer.color;

      if (this.isGridFull(game.grid)) {
        game.gameStatus = "completed";
        await this.calculateAndAssignScores(game);
      } else {
        game.currentPlayerIndex =
          (game.currentPlayerIndex + 1) % game.players.length;
      }

      await game.save();
      return res.status(200).json({ success: true, game });
    } catch (error: any) {
      console.log(error.message);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error making move",
          error: error.message,
        });
    }
  };

  calculateAndAssignScores = async (game: any) => {
    let grid = game.grid;
    let players = game.players;

    let n = grid.length;

    console.log(grid);
    console.log(players);

    // check rows
    for (let i = 0; i < n; i++) {
      let color = grid[i][0];
      let sameColor = true;

      for (let j = 1; j < grid[i].length; j++) {
        if (grid[i][j] !== color) {
          sameColor = false;
          break;
        }
      }

      if (sameColor) {
        players.forEach((player: any) => {
          if (player.color === color) {
            player.score += 1;
            console.log(
              `Player ${player.color} score updated for (row): ${player.score}`
            );
          }
        });
      }
    }

    // check columns
    for (let j = 0; j < grid[0].length; j++) {
      let color = grid[0][j];
      let sameColor = true;

      for (let i = 1; i < n; i++) {
        if (grid[i][j] !== color) {
          sameColor = false;
          break;
        }
      }

      if (sameColor) {
        players.forEach((player: any) => {
          if (player.color === color) {
            player.score += 1;
            console.log(
              `Player ${player.color} score updated for (col): ${player.score}`
            );
          }
        });
      }
    }

    // check all diagonals from top-left to bottom-right

    //first half
    for (let start = 0; start < n; start++) {
      let color = grid[start][0];
      let sameColor = true;

      for (let i = start, j = 0; i < n && j < n; i++, j++) {
        if (grid[i][j] !== color) {
          sameColor = false;
          break;
        }
      }

      if (sameColor && start < n - 1) {
        players.forEach((player: any) => {
          if (player.color === color) {
            player.score += 1;
            console.log(
              `Player ${player.color} score updated top-left to bottom-right:(1st part): ${player.score}`
            );
          }
        });
      }
    }
    //second half
    for (let start = 1; start < n; start++) {
      let color = grid[0][start];
      let sameColor = true;

      for (let i = 0, j = start; i < n && j < n; i++, j++) {
        if (grid[i][j] !== color) {
          sameColor = false;
          break;
        }
      }

      if (sameColor && start < n - 1) {
        players.forEach((player: any) => {
          if (player.color === color) {
            player.score += 1;
            console.log(
              `Player ${player.color} score updated top-left to bottom-right(2nd part) : ${player.score}`
            );
          }
        });
      }
    }

    // check all diagonals from bottom-left to top-right

    //first half
    for (let start = 0; start < n; start++) {
      let color = grid[start][0];
      let sameColor = true;

      for (let i = start, j = 0; i >= 0 && j < n; i--, j++) {
        if (grid[i][j] !== color) {
          sameColor = false;
          break;
        }
      }

      if (sameColor && start > 0) {
        players.forEach((player: any) => {
          if (player.color === color) {
            player.score += 1;
            console.log(
              `Player ${player.color} score updated bottom-left to top-right (1st part) : ${player.score}`
            );
          }
        });
      }
    }

    //second half
    for (let start = 1; start < n; start++) {
      let color = grid[n - 1][start];
      let sameColor = true;

      for (let i = n - 1, j = start; i >= 0 && j < n; i--, j++) {
        if (grid[i][j] !== color) {
          sameColor = false;
          break;
        }
      }

      if (sameColor && start < n - 1) {
        players.forEach((player: any) => {
          if (player.color === color) {
            player.score += 1;
            console.log(
              `Player ${player.color} score updated bottom-left to top-right (2nd part) : ${player.score}`
            );
          }
        });
      }
    }
  };

  isGridFull = (grid: (string | null)[][]): boolean => {
    return !grid.some((row) => row.includes(null));
  };
}
