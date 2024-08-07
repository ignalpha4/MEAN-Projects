import { categoryController } from "../controllers/categoryController";
import { productController } from "../controllers/productController";
import { supplierController } from "../controllers/supplierController";

export const TYPES = {


    //controllers
    authContoller :Symbol.for('authContoller'),
    supplierController:Symbol.for('supplierController'),
    categoryController:Symbol.for('categoryController'),
    productController:Symbol.for('productController'),

    //services
    authService:Symbol.for('authService'),
}