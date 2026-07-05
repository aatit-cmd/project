import mongoose  from "mongoose";;

// brand schema (name ,description, logo)
const brandSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, "brand_name is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    description : {
        type : String,
        required : [true,"description is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    logo : {
        type : String

    }
})

// brand model
const Brand = mongoose.model("brand",brandSchema);

export default Brand;