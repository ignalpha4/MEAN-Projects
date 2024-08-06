import { Container } from "inversify";
import { TYPES } from "./Types/user.types";
import { questionsController,examController,userController } from "./controllers/";
import { authService,questionsService,ExamService } from "./services/";


const container = new Container();
container.bind<userController>(TYPES.userController).to(userController)
container.bind<questionsController>(TYPES.questionsController).to(questionsController)
container.bind<examController>(TYPES.examController).to(examController)
//services bind
container.bind<authService>(TYPES.authService).to(authService);
container.bind<questionsService>(TYPES.questionsService).to(questionsService);
container.bind<ExamService>(TYPES.ExamService).to(ExamService)

export {container}
