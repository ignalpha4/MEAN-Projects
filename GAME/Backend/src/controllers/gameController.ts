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

  
    let rowPoints = 1;
    let rowStart = col;
    while (rowStart > 0 && grid[row][rowStart - 1] === color) {
        rowPoints++;
        rowStart--;
    }
    rowStart = col + 1;
    while (rowStart < size && grid[row][rowStart] === color) {
        rowPoints++;
        rowStart++;
    }
    if (rowPoints === size) {
        points++;
        console.log("For row");
    }


    let colPoints = 1;
    let colStart = row;
    while (colStart > 0 && grid[colStart - 1][col] === color) {
        colPoints++;
        colStart--;
    }
    colStart = row + 1;
    while (colStart < size && grid[colStart][col] === color) {
        colPoints++;
        colStart++;
    }
    if (colPoints === size) {
        points++;
        console.log("For col");
    }

    let mainDiagPoints = 1;
    let mainDiagRow = row;
    let mainDiagCol = col;
    while (mainDiagRow > 0 && mainDiagCol > 0 && grid[mainDiagRow - 1][mainDiagCol - 1] === color) {
        mainDiagPoints++;
        mainDiagRow--;
        mainDiagCol--;
    }
    mainDiagRow = row + 1;
    mainDiagCol = col + 1;
    while (mainDiagRow < size && mainDiagCol < size && grid[mainDiagRow][mainDiagCol] === color) {
        mainDiagPoints++;
        mainDiagRow++;
        mainDiagCol++;
    }
    if (mainDiagPoints === size) {
        points++;
        console.log("For main diagonal");
    }

    let antiDiagPoints = 1;
    let antiDiagRow = row;
    let antiDiagCol = col;
    while (antiDiagRow > 0 && antiDiagCol < size - 1 && grid[antiDiagRow - 1][antiDiagCol + 1] === color) {
        antiDiagPoints++;
        antiDiagRow--;
        antiDiagCol++;
    }
    antiDiagRow = row + 1;
    antiDiagCol = col - 1;
    while (antiDiagRow < size && antiDiagCol >= 0 && grid[antiDiagRow][antiDiagCol] === color) {
        antiDiagPoints++;
        antiDiagRow++;
        antiDiagCol--;
    }
    if (antiDiagPoints === size) {
        points++;
        console.log("For anti diagonal");
    }


    const smallerDiagonalOffsets = [
        { deltaRow: -1, deltaCol: 1 }, 
        { deltaRow: -1, deltaCol: -1 }, 
        { deltaRow: 1, deltaCol: 1 },
        { deltaRow: 1, deltaCol: -1 }
    ];

    for (const { deltaRow, deltaCol } of smallerDiagonalOffsets) {
        let smallerDiagPoints = 0;
        let smallerDiagRow = row;
        let smallerDiagCol = col;


        while (smallerDiagRow >= 0 && smallerDiagRow < size && smallerDiagCol >= 0 && smallerDiagCol < size) {
            if (grid[smallerDiagRow][smallerDiagCol] === color) {
                smallerDiagPoints++;
            } else {
                break; 
            }
            smallerDiagRow += deltaRow;
            smallerDiagCol += deltaCol;
        }

  
        smallerDiagRow = row - deltaRow;
        smallerDiagCol = col - deltaCol;
        while (smallerDiagRow >= 0 && smallerDiagRow < size && smallerDiagCol >= 0 && smallerDiagCol < size) {
            if (grid[smallerDiagRow][smallerDiagCol] === color) {
                smallerDiagPoints++;
            } else {
                break; 
            }
            smallerDiagRow -= deltaRow;
            smallerDiagCol -= deltaCol;
        }

       
        if (smallerDiagPoints >= 2) {
            
            const startRow = row + deltaRow * (smallerDiagPoints - 1);
            const startCol = col + deltaCol * (smallerDiagPoints - 1);
            const endRow = row - deltaRow * (smallerDiagPoints - 1);
            const endCol = col - deltaCol * (smallerDiagPoints - 1);

     
            if ((startRow >= 0 && startRow < size && startCol >= 0 && startCol < size) &&
                (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size)) {
                points++;
                console.log("For small diagonals");
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
