import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name : {
        type: String,
        required : [true, "Please provide a name"], 
    },
    email : {
        type : String,
        unique : true,
        required : [true, "Please provide a email"]
    },
    password: {
        type: String,
        unique : true,
        required : [true, "Please provide a password"]
    },
    media: [{
        type: String
    }],
    isVerified : {
        type: Boolean,
        default : false
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date
},
{timestamps : true})

const User = mongoose.models.users || mongoose.model("users", userSchema)
export default User