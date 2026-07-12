import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cookieParser from "cookie-parser";

// @types/packageName 
// this is dev dependency package which is used to provide type definitions for the express package. It allows TypeScript to understand the types and interfaces of the express library, enabling better type checking and autocompletion in your code editor.

import routes from "./routes"

//* creating app instance
const app = express();

//! using middlewares
app.use(express.json({limit: "10mb"}));
app.use(cookieParser());


//* health route
app.get("/",(req:Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "server is up and running",
        success: "true",
        status : "success",
        data : null,
    })
})

//! using routes
app.use("/api/v1",routes);


//! path not found
app.use((req:Request,res:Response,next:NextFunction)=>{
    const message = `can not ${req.method} on ${req.path}`;
    
    // res.status(404).json({
    //     message,
    //     success: false,
    //     status: "fail",
    //     data : null,
    // })

    const error: any = new Error(message);
    error.status = "fail"
    error.statusCode = 404
    next(error)
})

//* using error handler
app.use(errorHandler)


export default app;
