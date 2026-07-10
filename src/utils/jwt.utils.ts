import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types/gloabal.types";


//* generate jwt token
export const generateJwtToken = (payload: IJwtPayload) =>{
    try {
        return jwt.sign(payload, "asmddkngo!@##mfas", {
        expiresIn: "7 d" ,  // 7 days
    })}
    catch (error) {
        console.log(error);
        throw error;
    }
}