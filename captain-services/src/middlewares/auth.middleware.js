import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Captain } from "../models/captain.model.js";


export const verifyCaptain = asyncHandler( async(req,_,next) =>{
  try {
    const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","")   
 
    if(!token){
     throw new ApiError(401,"Unauthorized Request")
    }
 
   const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
   const captain = await Captain.findById(decodedToken?._id).select("-password -refreshToken")
   
   if(!captain){
     
     throw new ApiError(401, "Invalid Access Token")
   }
 
   req.captain = captain;
   next()
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")
    
   }
})