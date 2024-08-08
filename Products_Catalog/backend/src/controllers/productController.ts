import { controller, httpDelete, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middlewares";
import {Response,Request} from 'express';
import { ErrorHandling } from "../utils";
import product from "../models/productModel";
import upload from "../middlewares/productImage";
import mongoose from "mongoose";

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

            const ExistingProduct = await product.findOne({P_Name});

            let newProduct;
            let message;

            if(ExistingProduct){
                newProduct = await product.findByIdAndUpdate(ExistingProduct._id,productInfo);
                message =  "product details updated"
              }else{
              newProduct =  await  product.create(productInfo);
                message = "new product added"
            }


            if(!newProduct){
                throw new Error('Error while creating the product');
            }

            return res.json({status:true,message,product:newProduct});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }


    @httpGet('/listProducts',verifyToken)
    async listProducts(req:any,res:Response){
        try {

            const products =  await product.aggregate(
                [
                    {
                      $lookup: {
                        from: "categories",
                        localField: "P_Category",
                        foreignField: "_id",
                        as: "category_details"
                      }
                    },
                    {
                      $lookup: {
                        from: "suppliers",
                        localField: "P_Supplier",
                        foreignField: "_id",
                        as: "supplier_details"
                      }
                    },
                    {
                      $unwind: "$category_details"
                    },
                    {
                      $unwind: "$supplier_details"
                    },
                    {
                      $project: {
                        P_Name: 1,
                        P_Desc: 1,
                        P_Price: 1,
                        P_Image: 1,
                        "category_details": 1,
                        "supplier_details": 1
                      }
                    }
             
            ]);

            
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

    @httpGet('/productById/:id',verifyToken)
    async productById(req:any,res:Response){
        try {
            const id = req.params.id;
            
            const foundProduct =  await product.aggregate(
                [
                    {
                        $match:{_id :new mongoose.Types.ObjectId(id)}
                    },
                    {
                      $lookup: {
                        from: "categories",
                        localField: "P_Category",
                        foreignField: "_id",
                        as: "category_details"
                      }
                    },
                    {
                      $lookup: {
                        from: "suppliers",
                        localField: "P_Supplier",
                        foreignField: "_id",
                        as: "supplier_details"
                      }
                    },
                    {
                      $unwind: "$category_details"
                    },
                    {
                      $unwind: "$supplier_details"
                    },
                    {
                      $project: {
                        P_Name: 1,
                        P_Desc: 1,
                        P_Price: 1,
                        P_Image: 1,
                        "category_details": 1,
                        "supplier_details": 1
                      }
                    }
            ]);

            

            if(!foundProduct){
                throw new Error('No products found');
            }

            return res.json({status:true,message:"Products found",product:foundProduct});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
        }
    }

    @httpDelete('/delete/:id',verifyToken)
    async deleteProduct(req:any,res:any){

        try {
            const id = req.params.id;
            console.log(id);
            

            const deleteProduct =  await product.findByIdAndDelete(id)

            if(!deleteProduct){
                throw new Error('Unable to delete the Product');
            }

            return res.json({status:true,message:'Product deleted successfullyy',deleteProduct});

        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
        }

    }

}