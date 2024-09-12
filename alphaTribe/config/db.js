import mongoose from "mongoose";

export const connectDB = async () => {
    try{

        await mongoose.connect(process.env.dbURI, {
            dbName: 'AlphaTribe'
        });
        console.log("Connected to the database");
    } catch(err){
        console.error("Error connecting to the database, Error: ", err);
        throw err;
    }
}