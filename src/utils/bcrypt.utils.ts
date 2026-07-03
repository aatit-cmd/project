import bcrypt from "bcryptjs";

//* hashPassword
export const hashPassword = async (password:string) => {
    try{
        
        // salt
        const salt = await bcrypt.genSalt(10);

        // hash
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
    catch (error){
        console.log(error);
        throw error;
    }
}

//* compare password