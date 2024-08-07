import { Container } from "inversify";
import { TYPES } from "./Types/user.types";
import { authContoller } from "./controllers/";
import { authService } from "./services/";
import { supplierController } from "./controllers/supplierController";
import { categoryController } from "./controllers/categoryController";
import { productController } from "./controllers/productController";


const container = new Container();


//controller
container.bind<authContoller>(TYPES.authContoller).to(authContoller)
container.bind<supplierController>(TYPES.supplierController).to(supplierController)
container.bind<categoryController>(TYPES.categoryController).to(categoryController)
container.bind<productController>(TYPES.productController).to(productController)

//services
container.bind<authService>(TYPES.authService).to(authService);

export {container}
