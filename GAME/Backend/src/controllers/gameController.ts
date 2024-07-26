import { Request, Response } from 'express';
import Game from '../models/game.model';

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

        const points = calculatePoints(game.grid, row, col, currentPlayer.color);
        currentPlayer.score += points;

        if (isGridFull(game.grid)) {
            game.gameStatus = 'completed';
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

const calculatePoints = (grid: string[][], row: number, col: number, color: string): number => {
    let points = 0;
    const size = grid.length;

    for (let i = 0; i < size; i++) {
        if (grid[row][i] !== color) break;
        if (i === size - 1) points += 1;
    }
    for (let i = 0; i < size; i++) {
        if (grid[i][col] !== color) break;
        if (i === size - 1) points += 1;
    }

 
    if (row === col) {
        for (let i = 0; i < size; i++) {
            if (grid[i][i] !== color) break;
            if (i === size - 1) points += 1;
        }
    }


    if (row + col === size - 1) {
        for (let i = 0; i < size; i++) {
            if (grid[i][(size - 1) - i] !== color) break;
            if (i === size - 1) points += 1;
        }
    }

    
    for (let i = 0; i < size; i++) {
       
        if (row - col === i - i) {
            for (let j = 0; j < size; j++) {
                if (grid[j][j] !== color) break;
                if (j === size - 1) points += 1;
            }
        }

        if (row + col === i + (size - 1 - i)) {
            for (let j = 0; j < size; j++) {
                if (grid[j][(size - 1) - j] !== color) break;
                if (j === size - 1) points += 1;
            }
        }
    }

    return points;
};




const isGridFull = (grid: any) => {
    for (let row of grid) {
        if (row.includes(null)) {
            return false;
        }
    }
    return true;
};

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
        return res.status(500).json({ success: false, message: 'Error retrieving game details', error: error.message });
    }
};
