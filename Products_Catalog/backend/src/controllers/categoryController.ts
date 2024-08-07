import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middlewares";
import {Response,Request} from 'express';
import { ErrorHandling } from "../utils";
import category from "../models/categoryModel";

const errorObj = new ErrorHandling();

@controller('/category')
export class categoryController {

    @httpPost('/add',verifyToken)
    async addCategory(req:any,res:Response){
        try {
         
            
            const {C_Name} = req.body;

            if(!C_Name){
                throw new Error('Required fields are not provided');
            }

            const newCategory =  await category.create(req.body);

            if(!newCategory){
                throw new Error('Error while creating the category');
            }

            return res.json({status:true,message:"added the category",category:newCategory});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }


    @httpGet('/listCategories',verifyToken)
    async listCategories(req:any,res:Response){
        try {

            const categories =  await category.find();

            if(!categories){
                throw new Error('No categories found');
            }

            return res.json({status:true,message:"List of categories",categories:categories});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }

}