import { Container } from "inversify";
import { userController } from "./controllers/authContoller";

const container = new Container();
container.bind(userController).to(userController)

export {container}
