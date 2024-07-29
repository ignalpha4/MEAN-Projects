import { Request, Response } from 'express';
import Game from '../models/game.model';




export const getGameDetails = async (req: Request, res: Response) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId).populate('players');

        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

        return res.status(200).json({ success: true, game });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Error fetching game details', error: error.message });
    }
};


export const getAllGameDetails = async (req: Request, res: Response) => {
    try {
        const games = await Game.find({ gameStatus: 'completed' }).populate('players');

        if (!games) {
            return res.json({ success: false, message: "No completed games found" });
        }

        return res.json({ success: true, message: "Completed games found", games });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Error fetching completed games', error: error.message });
    }
};



export const createGame = async (req: Request, res: Response) => {
    try {
        const { size, players } = req.body;

        if (!size || size < 3) {
            return res.status(400).json({ success: false, message: "Grid size must be at least 3" });
        }

        if (!players || players.length === 0) {
            return res.status(400).json({ success: false, message: "No player info provided" });
        }

        const grid = Array.from({ length: size }, () => Array(size).fill(null));

        const newGame = new Game({
            size,
            players,
            grid,
            currentPlayerIndex: 0,
            gameStatus: 'in-progress'
        });

        await newGame.save();

        return res.status(200).json({ success: true, message: 'Game created successfully', game: newGame });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Error creating game', error: error.message });
    }
};


export const makeMove = async (req: Request, res: Response) => {
    try {
        const { gameId, row, col } = req.body;
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

        if (game.grid[row][col] !== null) {
            return res.status(400).json({ success: false, message: 'Cell already occupied' });
        }

        const currentPlayer = game.players[game.currentPlayerIndex];
        game.grid[row][col] = currentPlayer.color;

        // Check game status
        if (isGridFull(game.grid)) {
            game.gameStatus = 'completed';
            await calculateAndAssignScores(game); 
        } else {
            game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
        }

        await game.save();
        return res.status(200).json({ success: true, game });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Error making move', error: error.message });
    }
};


const calculateAndAssignScores = async (game: any) => {
    let grid = game.grid;
    let players = game.players;

    let n = grid.length;

    console.log(grid);
    console.log(players);

    // Check rows
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
                    console.log(`Player ${player.color} score updated: ${player.score}`);
                }
            });
        }
    }

    // Check columns
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
                    console.log(`Player ${player.color} score updated: ${player.score}`);
                }
            });
        }
    }

    //left to right diagonal
    let sameColor = true;
    let gridColor:any;
    for (let i = 0; i < n; i++) {
        let color = grid[0][0];
        gridColor =color;
        for (let j = 0; j < n; j++) {
            if(i==j){

                if (grid[i][j] !== color) {
                    sameColor = false;
                    break;
                }
            }

        }
    }
    if (sameColor) {
        players.forEach((player: any) => {
            if (player.color === gridColor) {
                player.score += 1;
                console.log(`Player ${player.color} score updated: ${player.score}`);
               
            }
        });
    }



    let times = n;

    while(times--){

        // right to left 
        sameColor = true;
        gridColor;

        for (let i = 0; i < n; i++) {

            let color = grid[0][n-1];
    
            gridColor =color;
            for (let j = 0; j < n; j++) {
                if((i+j)==(n-1)){
                    if (grid[i][j] !== color) {
                        sameColor = false;
                        break;
                    }
                }
    
            }
        }

        
            console.log(sameColor);
            
            if (sameColor) {
                players.forEach((player: any) => {
                    if (player.color === gridColor) {
                        player.score += 1;
                        console.log(`Player ${player.color} score updated: ${player.score}`);
                    }
                });
            }
   

    }





};





const isGridFull = (grid: (string | null)[][]): boolean => {
    return !grid.some(row => row.includes(null));
};
