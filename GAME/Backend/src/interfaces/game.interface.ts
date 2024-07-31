import { IPlayer } from "./player.interface";

export interface IGame extends Document {
    size: number;
    players: IPlayer[];
    grid: string[][];
    currentPlayerIndex: number;
    gameStatus: string;
}