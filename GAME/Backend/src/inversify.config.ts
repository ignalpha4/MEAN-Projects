import { Container } from "inversify";
import { TYPES } from "./types/types";
import { userController } from "./controllers/userController";
import { gameController } from "./controllers/gameController";


const container = new Container();

container.bind<userController>(TYPES.userController).to(userController)
container.bind<gameController>(TYPES.gameController).to(gameController)


export {container}