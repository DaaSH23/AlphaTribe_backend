import jwt from "jsonwebtoken"
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/userModel.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const authorization = catchAsyncError(async (req, res, next)=>{
    const token = req.cookies.token;
    // console.log(token);
    if(!token){
        return next(new ErrorHandler("Session Expire, Authorization denied", 401));
    }
    try{
        const data = jwt.verify(token, process.env.TOKENSIGNATURE);
        // console.log(data.userId);
        const userId = data.userId;
        const user = await User.findOne({userId}).select('-password'); //fetch data without password
        // console.log("user: ", user);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        req.user = user;
        next(); 
    }catch(err){
        return next(new ErrorHandler("Invalid Token", 401));
    }
})