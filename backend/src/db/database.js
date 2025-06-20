import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config(); 

const connectionToDatabase = async () => {
    try {
        const instanceConnection = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("Connected to mongoDb Successfully :",instanceConnection.connection.host);
        
    } catch (error) {
        console.log("Error in while conneting to database in file " , error);
        process.exit(1)
    }
}


export {connectionToDatabase}