import { Container } from "inversify";
import { userController } from "./controllers/authContoller";
import { TYPES } from "./Types/user.types";
import { questionsController } from "./controllers/questionsController";
import { examController } from "./controllers/examController";

const container = new Container();

container.bind<userController>(TYPES.userController).to(userController)
container.bind<questionsController>(TYPES.questionsController).to(questionsController)
container.bind<examController>(TYPES.examController).to(examController)

export {container}
