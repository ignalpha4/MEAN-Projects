import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middlewares";
import {Response,Request} from 'express';
import { ErrorHandling } from "../utils";
import supplier from "../models/suppliersModel";

const errorObj = new ErrorHandling();

@controller('/supplier')
export class supplierController {

    @httpPost('/add',verifyToken)
    async addSupplier(req:any,res:Response){
        try {
            console.log("adding supplier");
            
            const {S_Name,S_Contact,S_Address} = req.body;

            if(!S_Name || !S_Contact || !S_Address){
                throw new Error('Required fields are not provided');
            }

            const newSupplier =  await supplier.create(req.body);

            if(!newSupplier){
                throw new Error('Error while creating the supplier');
            }

            return res.json({status:true,message:"added the supplier",supplier:newSupplier});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }


    @httpGet('/listSuppliers',verifyToken)
    async listSupplier(req:any,res:Response){
        try {

            const suppliers =  await supplier.find();

            if(!suppliers){
                throw new Error('No suppliers found');
            }

            return res.json({status:true,message:"List of suppliers",suppliers:suppliers});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errormsg);
            return res.json({ status: false, message: errormsg });
            
        }

    }

}