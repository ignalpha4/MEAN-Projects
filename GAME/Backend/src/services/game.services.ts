import { injectable } from "inversify";
import Game from "../models/game.model";

@injectable()
export class gameService {

    async getGameById(gameId: any) {
        try{
            return await Game.findById(gameId).populate('players');
        } catch (error:any) {
            throw  Error(`Error fetching game with ID ${gameId}: ${error.message}`);
        }
    }

    async getAllGames() {
        try {
            return await Game.find().populate('players');
        } catch (error:any) {
            throw  Error(`Error fetching all games: ${error.message}`);
        }
    }

    async createGame(gameInfo: any) {
        try {
            return await Game.create(gameInfo);
        }catch (error:any) {
            throw  Error(`Error creating game: ${error.message}`);
        }
    }

    async updateGame(game: any) {
        try {
            return await game.save();
        } catch (error:any) {
            throw  Error(`Error updating game: ${error.message}`);
        }
    }

    isGridFull(grid: (string | null)[][]): boolean {
        return !grid.some((row) => row.includes(null));
    }

    async calculateAndAssignScores(game: any) {
        const grid = game.grid;
        const players = game.players;
        const n = grid.length;

        console.log(grid);
        console.log(players);

        const updatePlayerScore = (color: string) => {
            players.forEach((player: any) => {
                if (player.color === color) {
                    player.score += 1;
                    console.log(`Player ${player.color} score updated: ${player.score}`);
                }
            });
        };

        // check rows
        for (let i = 0; i < n; i++) {
            const color = grid[i][0];
            if (color && grid[i].every((cell:any) => cell === color)) {
                updatePlayerScore(color);
            }
        }

        // check col
        for (let j = 0; j < n; j++) {
            const color = grid[0][j];
            if (color && grid.every((row:any) => row[j] === color)) {
                updatePlayerScore(color);
            }
        }

        // check diagonals (top-left to bottom-right)
        for (let start = 0; start < n; start++) {
            // first half
            let color = grid[start][0];
            if (color) {
                let sameColor = true;
                for (let i = start, j = 0; i < n && j < n; i++, j++) {
                    if (grid[i][j] !== color) {
                        sameColor = false;
                        break;
                    }
                }
                if (sameColor && start < n - 1) {
                    updatePlayerScore(color);
                }
            }

            //second half
            color = grid[0][start];
            if (color) {
                let sameColor = true;
                for (let i = 0, j = start; i < n && j < n; i++, j++) {
                    if (grid[i][j] !== color) {
                        sameColor = false;
                        break;
                    }
                }
                if (sameColor && start < n - 1) {
                    updatePlayerScore(color);
                }
            }
        }

        //check diagonals (bottom-left to top-right)
        for (let start = 0; start < n; start++) {
            // first half
            let color = grid[start][0];
            if (color) {
                let sameColor = true;
                for (let i = start, j = 0; i >= 0 && j < n; i--, j++) {
                    if (grid[i][j] !== color) {
                        sameColor = false;
                        break;
                    }
                }
                if (sameColor && start > 0) {
                    updatePlayerScore(color);
                }
            }

            // second half
            color = grid[n - 1][start];
            if (color) {
                let sameColor = true;
                for (let i = n - 1, j = start; i >= 0 && j < n; i--, j++) {
                    if (grid[i][j] !== color) {
                        sameColor = false;
                        break;
                    }
                }
                if (sameColor && start < n - 1) {
                    updatePlayerScore(color);
                }
            }
        }
    }
}
