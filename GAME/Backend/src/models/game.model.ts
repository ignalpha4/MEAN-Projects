import mongoose, { Document, Schema } from 'mongoose';

interface PlayerInfo {
    name: string;
    color: string;
    score: number;
}

interface Game extends Document {
    size: number;
    players: PlayerInfo[];
    grid: string[][];
    currentPlayerIndex: number;
    gameStatus: string;
}

const playerInfoSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    score: { type: Number, default: 0 }
});

const gameSchema = new Schema<Game>({
    size: { type: Number, required: true },
    players: [playerInfoSchema],
    grid: { type: [[String]], required: true },
    currentPlayerIndex: { type: Number, required: true },
    gameStatus: { type: String, default: 'in-progress' }
});

const Game = mongoose.model<Game>('Game', gameSchema);

export default Game;
