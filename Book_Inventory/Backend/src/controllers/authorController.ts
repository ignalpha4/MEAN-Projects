import authorModel from "../models/authorModel";
import bcrypt from "bcrypt"
import userModel from "../models/userModel";

// Add author

export const addAuthor = async (req: any, res: any) => {
    try {

        const { name, email, password, biography, nationality,profileImage } = req.body;

        // Create user in userModel
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await userModel.create({ name, email, password: hashedPassword, role: 'author',profileImage });

        if (!createdUser) {
            console.log("Error creating the user");
            return res.json({ success:false,message: "Error creating the user" });
        }

        // Create author in authorModel
        const author = await authorModel.create({ userId: createdUser._id, name, biography, nationality });

        if (!author) {
            console.log("Error creating the author");
            // If author creation fails, delete the user created earlier
            await userModel.findByIdAndDelete(createdUser._id);
            return res.json({ success:false,message: "Error creating the author" });
        }

        console.log("Author and User created successfully");
        res.json({success:true,message: "Author and User created successfully", author, user: createdUser });
    } catch (error) {
        console.error('Error adding author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// List authors
export const listAuthors = async (req: any, res: any) => {
    try {

        let foundAuthors;
        let authordetails;

    
        if(req.user.role==='author'){
            foundAuthors =  await authorModel.find({userId:req.user.id});
        }else{
            foundAuthors =  await authorModel.find();
        }

        if (!foundAuthors) {
            console.log("No authors found");
            return res.json({success:false, message: "No authors found" });
        }

        res.status(200).json({ message: "List of Authors", authors: foundAuthors });

    } catch (error) {
        console.error('Error listing authors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete author
export const deleteAuthor = async (req: any, res: any) => {
    try {
        const  id  = req.params.id;

        let deletedAuthor:any;
        let deletedUser:any

  

        if(req.user.role === 'author'){
            let foundAuthorDetials =  await authorModel.findById(req.params.id);
            
            if(req.user.id === foundAuthorDetials?.userId.toHexString()){
                deletedAuthor = await authorModel.findByIdAndDelete(id);
                deletedUser = await userModel.findByIdAndDelete(deletedAuthor.userId);

                res.json({success:true,authorDeleted:true,message:"author deleted his profile",});
                return;

            }else{
                throw new Error("Not authorized to delte this author");
            }
        }else{
            deletedAuthor = await authorModel.findByIdAndDelete(id);
            deletedUser = await userModel.findByIdAndDelete(deletedAuthor.userId);
        }

        if (!deletedAuthor || !deletedUser) {
            console.log("No author or his user details found to delete");
            return res.json({success:false, message: "No author or userdetails found to delete" });
        }


        res.json({ success:true,message: "Deleted Author and user assosiated:", author: deletedAuthor ,user:deletedUser});
        
    } catch (error:any) {
        console.error('Error deleting author:', error);
        res.status(500).json({ message: error.message });
    }
}

// Update author +a,u
export const updateAuthor = async (req: any, res: any) => {
    try {
        const id = req.params.id;
   
        let updatedAuthor:any;
        let updatedUser:any;

        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        if(req.user.role ==='author'){
            if(req.user.id === req.body.userId){
             
                updatedAuthor= await authorModel.findByIdAndUpdate(id,req.body);
                updatedUser =  await userModel.findByIdAndUpdate(updatedAuthor.userId,{email:req.body.email,password:hashedPassword,profileImage:req.body.profileImage});
            }else{
                throw new Error("Not authorized to update the profile")
            }
        }else{
            updatedAuthor = await authorModel.findByIdAndUpdate(id, req.body);
            updatedUser =  await userModel.findByIdAndUpdate(updatedAuthor.userId,{email:req.body.email,password:hashedPassword});
        }


        
    
        if (!updatedAuthor || !updatedUser) {
            console.log("No author details found to update");
            return res.json({success:false, message:"No author details found to update"});
        }

        res.json({ success:true,message: "Author Details updated", author: updatedAuthor , user:updatedUser });

    } catch (error:any) {
        console.error('Error updating author:', error);
        res.status(500).json({ message: error.message });
    }
}
