import { Container } from "inversify";
import { TYPES } from "./types/types";
import { userController } from "./controllers/userController";
import { gameController } from "./controllers/gameController";
import { userService } from "./services/user.services";
import { gameService } from "./services/game.services";


const container = new Container();

container.bind<userController>(TYPES.userController).to(userController);
container.bind<gameController>(TYPES.gameController).to(gameController);

//services 

container.bind<userService>(TYPES.userService).to(userService);
container.bind<gameService>(TYPES.gameService).to(gameService);

export {container}