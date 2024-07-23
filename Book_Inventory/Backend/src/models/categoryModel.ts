//fiction, non-fiction, romance, thriller, etc.
import mongoose, { mongo } from "mongoose"
import { ICategoryModel } from "../interfaces/categoryModelInterface";

const categorySchema = new mongoose.Schema<ICategoryModel>({
    name:{
            type:String,
            required:true
        }
}) 

const categoryModel = mongoose.model<ICategoryModel>('Category',categorySchema);
export default categoryModel;

