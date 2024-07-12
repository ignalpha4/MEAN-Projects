import categoryModel from "../models/categoryModel";


export const addCategory =async(req:any,res:any)=>{

    try {
        const category =req.body;
   
        const addedCat =await categoryModel.create(category);
     
        if(!addedCat){
          console.log("provide the necessary details to add Category ");
          res.status(400).json({message:"provide the necessary details to add Category"})
        }
        console.log("Added Category",addedCat);
        res.status(200).json({message:"Category added",Category:addedCat});

    } catch (error) {
        console.log(error);
    }
}

export const listCategory = async(req:any,res:any)=>{
    try {
        const foundCat= await categoryModel.find();

        if(!foundCat){
            console.log("No Category found ");
            res.status(400).json({message:"No Category found"})
        }

        console.log("Available Categories \n",foundCat);

        res.status(200).json({message:"Available Category \n",Category:foundCat});

    } catch (error) {
        console.log(error);        
    }
}


export const deleteCategory = async(req:any,res:any)=>{
    
    try{
        const {id} = req.body;

        const deletedCat = await categoryModel.findByIdAndDelete(id);

        if(!deletedCat){
            console.log("No Category found to delete");
            res.status(400).json({message:"No Category found to delete"})
        }

        console.log("Category Deleted \n",deletedCat);

        res.status(200).json({message:"Deleted Category \n",Category:deletedCat});


    } catch (error) {
        console.log(error);
        
    }
}

export const updateCategory=async(req:any,res:any)=>{

    try {
        
        const {id} = req.body;

        const updatedCat = await categoryModel.findByIdAndUpdate(id,req.body);

        if(!updatedCat){
            console.log("No Category found to update");
            res.status(400).json({message:"No Category found to update"})
        }

        console.log("Category updated \n",updatedCat);

        res.status(200).json({message:" Category updated \n",Category:updatedCat});

    } catch (error) {
        console.log(error); 
    }
}