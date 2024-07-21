import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    username : {
        type: String,
        required : [true, "Please provide a name"], 
    },
    email : {
        type : String,
        unique : true,
        required : [true, "Please provide a email"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
        lowercase: true,
    },
    password: {
        type: String,
        required : [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    media: [{
        url: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    lastLogin: {
        type: Date,
        default : Date.now
    },
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