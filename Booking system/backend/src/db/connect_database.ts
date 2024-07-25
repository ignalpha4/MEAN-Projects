import mongoose from "mongoose";
import config from "config";


const connectDatabase = async () => {

  try {
    await mongoose.connect(
      config.get("MongoUrl")
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
  
};

export default connectDatabase;
