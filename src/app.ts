import express, { NextFunction, Request, Response } from "express";
// @types/packageName 
// this is dev dependency package which is used to provide type definitions for the express package. It allows TypeScript to understand the types and interfaces of the express library, enabling better type checking and autocompletion in your code editor.

//* creating app instance
const app = express();

//! using middlewares


//! using routes

//* health route
app.get("/",(req:Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "server is up and running",
        success: "true",
        status : "success",
        data : null,
    })
})

//! pathnot found
app.use((req:Request,res:Response,next:NextFunction)=>{
    const message = `can not ${req.method} on ${req.path}`;
    
    res.status(404).json({
        message,
        success: false,
        status: "fail",
        data : null,
    })
})


export default app;
