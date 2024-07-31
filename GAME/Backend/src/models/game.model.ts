import mongoose, { Document, Schema } from 'mongoose';
import { IPlayer } from '../interfaces/player.interface';
import { IGame } from '../interfaces/game.interface';

//player 
const playerInfoSchema = new Schema<IPlayer>({
    name: { type: String, required: true },
    color: { type: String, required: true },
    score: { type: Number, default: 0 }
});

//game
const gameSchema = new Schema<IGame>({
    size: { type: Number, required: true },
    players: [playerInfoSchema],
    grid: { type: [[String]], required: true },
    currentPlayerIndex: { type: Number, required: true },
    gameStatus: { type: String, default: 'in-progress' }
});

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;
