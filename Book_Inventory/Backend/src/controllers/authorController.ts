import authorModel from "../models/authorModel";
import bcrypt from "bcrypt"
import userModel from "../models/userModel";

// Add author

export const addAuthor = async (req: any, res: any) => {
    try {

        const { name, email, password, biography, nationality } = req.body;

        // Create user in userModel
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await userModel.create({ name, email, password: hashedPassword, role: 'author' });

        if (!createdUser) {
            console.log("Error creating the user");
            return res.status(400).json({ message: "Error creating the user" });
        }

        // Create author in authorModel
        const author = await authorModel.create({ userId: createdUser._id, name, biography, nationality });

        if (!author) {
            console.log("Error creating the author");
            // If author creation fails, delete the user created earlier
            await userModel.findByIdAndDelete(createdUser._id);
            return res.status(400).json({ message: "Error creating the author" });
        }

        console.log("Author and User created successfully");
        res.status(200).json({ message: "Author and User created successfully", author, user: createdUser });
    } catch (error) {
        console.error('Error adding author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// List authors
export const listAuthors = async (req: any, res: any) => {
    try {
        const foundAuthors = await authorModel.find();

        if (!foundAuthors) {
            console.log("No authors found");
            return res.status(404).json({ message: "No authors found" });
        }

        console.log("List of Authors \n", foundAuthors);
        res.status(200).json({ message: "List of Authors", authors: foundAuthors });
    } catch (error) {
        console.error('Error listing authors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete author
export const deleteAuthor = async (req: any, res: any) => {
    try {
        const { id } = req.body;

        const deletedAuthor = await authorModel.findByIdAndDelete(id);

        let UserAuthorID = deletedAuthor?.userId;

        let deletedUserInfo;
        if(UserAuthorID){
           deletedUserInfo =  await userModel.findByIdAndDelete(UserAuthorID);
        }


        if (!deletedAuthor) {
            console.log("No author found to delete");
            return res.status(404).json({ message: "No author found to delete" });
        }


        console.log("Author Deleted  and assosiated user credentials as well\n", deletedAuthor,deletedUserInfo);
        res.status(200).json({ message: "Deleted Author and user assosiated:", author: deletedAuthor ,user:deletedUserInfo});
        
    } catch (error) {
        console.error('Error deleting author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update author +a,u
export const updateAuthor = async (req: any, res: any) => {
    try {
        const { id } = req.body;
   
        let updatedAuthor:any;

        if(req.user.role =='author'){
            if(req.id == id){
                updatedAuthor= await authorModel.findByIdAndUpdate(id,req.body);
            }else{
                res.send("Not authorized to update the profile");
                throw new Error;
            }
        }else{
            updatedAuthor = await authorModel.findByIdAndUpdate(id, req.body);
        }

    
        if (!updatedAuthor) {
            console.log("No author found to update");
            return res.status(404).json({ message: "No author found to update" });
        }

        console.log("Author updated \n", updatedAuthor);
        res.status(200).json({ message: "Author updated", author: updatedAuthor });
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
