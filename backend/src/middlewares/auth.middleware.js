import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken';

export const protectedRoute = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken || req.header('Authorization')?.replace("Bearer ", "");
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            message: "You are not authorized to access this resource. Please login first"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (!decodedToken || !decodedToken._id){
            return res.status(401).json({
                message : "Invalid token !Please login again"
            })
        }
        // console.log("Decoded Token:", decodedToken._id);

        const user = await User.findById(decodedToken._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in Protecting route:", error.message);
        return res.status(500).json({
            message: "Internal server Error"
        });
    }
});
