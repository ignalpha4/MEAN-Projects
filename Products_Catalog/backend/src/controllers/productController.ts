import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middlewares";
import {Response,Request} from 'express';
import { ErrorHandling } from "../utils";
import product from "../models/productModel";
import upload from "../middlewares/productImage";

const errorObj = new ErrorHandling();

@controller('/products')
export class productController {

    @httpPost('/add',verifyToken,upload)
    async addProduct(req:any,res:Response){
        try {
            
            const {P_Name,P_Category,P_Price,P_Supplier,P_Desc} = req.body;

            if(!P_Name || !P_Category || !P_Price || !P_Supplier){
                throw new Error('Required fields are not provided');
            }
            const P_Image = req.file ? `/uploads/products/${req.file.filename}` : "";

            let productInfo = {
                P_Name,
                P_Category,
                P_Price,
                P_Supplier,
                P_Desc,
                P_Image
            }

            const newProduct =  await  product.create(productInfo);

            if(!newProduct){
                throw new Error('Error while creating the product');
            }

            return res.json({status:true,message:"added the product",product:newProduct});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }


    @httpGet('/listProducts',verifyToken)
    async listProducts(req:any,res:Response){
        try {

            const products =  await product.find();

            if(!products){
                throw new Error('No products found');
            }

            return res.json({status:true,message:"Products found",products:products});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }

}