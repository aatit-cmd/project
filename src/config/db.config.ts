import mongoose  from "mongoose";

export const connectDatabase = (DBI_URI: string)=>{
    mongoose.connect(DBI_URI).then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.log("---------database connection error-------------");
        console.log(error)
    })
}