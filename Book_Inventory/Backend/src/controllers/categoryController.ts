import categoryModel from "../models/categoryModel";


export const addCategory =async(req:any,res:any)=>{

    try {
        const category =req.body;
   
        const addedCat = await categoryModel.create(category);
     
        if(!addedCat){
          console.log("provide the necessary details to add Category ");
          res.json({success:false,message:"provide the necessary details to add Category"})
        }
        console.log("Added Category",addedCat);
        res.status(200).json({success:true,message:"Category added",Category:addedCat});

    } catch (error) {
        console.log(error);
    }
}

export const listCategory = async(req:any,res:any)=>{
    try {
        const foundCat= await categoryModel.find();

        if(!foundCat){
            console.log("No Category found ");
            res.json({message:"No Category found"})
        }

        console.log("Available Categories \n",foundCat);

        res.status(200).json({message:"Available Category \n",Category:foundCat});

    } catch (error) {
        console.log(error);        
    }
}


export const deleteCategory = async(req:any,res:any)=>{
    
    try{
        const _id = req.params.id;
        
        const deletedCat = await categoryModel.findByIdAndDelete(_id);

        if(!deletedCat){
            console.log("No Category found to delete");
            res.json({success:false,message:"No Category found to delete"})
        }

        console.log("Category Deleted \n",deletedCat);

        res.json({success:true,message:"Deleted Category \n",Category:deletedCat});


    } catch (error) {
        console.log(error);
        
    }
}

export const updateCategory=async(req:any,res:any)=>{

    try {
        const changedCat = await categoryModel.findByIdAndUpdate(req.params.id,req.body);

        if(!changedCat){
            console.log("No Category found to update");
            res.json({success:false,message:"No Category found to update"})
        }

        console.log("Category updated \n",changedCat);

        res.json({success:true,message:" Category updated \n",Category:changedCat});

    } catch (error) {
        console.log(error); 
    }
}