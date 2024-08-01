import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middleware/authentication";
import { TYPES } from "../types/types";
import { inject } from "inversify";
import { gameService } from "../services/game.services";

@controller("/user")
export class gameController {
  constructor(
    @inject<gameService>(TYPES.gameService) private gameService: gameService
  ) { }

  @httpGet("/games/:gameId", verifyToken)
  async getGameDetails(req: Request, res: Response) {
    try {
      const gameId = req.params.gameId;
      const game = await this.gameService.getGameById(gameId);

      if (!game) {
        return res.status(404).json({ success: false, message: "Game not found" });
      }

      return res.status(200).json({ success: true, game });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching game details",
        error: error.message,
      });
    }
  }

  @httpGet("/getAllGameDetails", verifyToken)
  async getAllGameDetails(req: Request, res: Response) {
    try {
      const games = await this.gameService.getAllGames();

      return res.status(200).json({
        success: true,
        message: "Completed games found",
        games,
      });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching completed games",
        error: error.message,
      });
    }
  }

  @httpPost("/games", verifyToken)
  async createGame(req: Request, res: Response) {
    try {
      const { size, players } = req.body;

      if (!size || size < 3) {
        return res.status(400).json({ success: false, message: "Grid size must be at least 3" });
      }

      if (!players || players.length === 0) {
        return res.status(400).json({ success: false, message: "No player info provided" });
      }

      const grid = Array.from({ length: size }, () => Array(size).fill(null));

      const gameInfo = {
        size,
        players,
        grid,
        currentPlayerIndex: 0,
        gameStatus: "in-progress",
      };

      const newGame = await this.gameService.createGame(gameInfo);

      return res.status(201).json({
        success: true,
        message: "Game created successfully",
        game: newGame,
      });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Error creating game",
        error: error.message,
      });
    }
  }

  @httpPost("/games/move", verifyToken)
  async makeMove(req: Request, res: Response) {
    try {
      const { gameId, row, col } = req.body;
      const game = await this.gameService.getGameById(gameId);

      if (!game) {
        return res.status(404).json({ success: false, message: "Game not found" });
      }

      if (game.grid[row][col] !== null) {
        return res.status(400).json({ success: false, message: "Cell already occupied" });
      }

      const currentPlayer = game.players[game.currentPlayerIndex];
      game.grid[row][col] = currentPlayer.color;

      if (this.gameService.isGridFull(game.grid)) {
        game.gameStatus = "completed";
        await this.gameService.calculateAndAssignScores(game);
      } else {
        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
      }

      await this.gameService.updateGame(game);
      return res.status(200).json({ success: true, game });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Error making move",
        error: error.message,
      });
    }
  }
}
