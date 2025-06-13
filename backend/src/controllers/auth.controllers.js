import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


// user signin controller
export const siginUpUser = asyncHandler( async (req ,res) => {
    const {fullname ,email ,password} = req.body;
    try {

        if ([fullname , email , password] .some((field) => typeof field !== 'string'  || field.trim() === '' )) {
            return res.status(400).json({
                message:"All fileds are required",
            })
        }

        if (password.length  < 6){
            return res.status(400).json({
                message : "Password must be at least 6 characters long",
            })
        } 

    // if user is already exists

    const existsUser = await  User.findOne({email})
    if(existsUser){
        return res.status(400).json({
            message : "User is already exists ! Try with another email"
        })
    }

    // create new user

    const user = await User.create({
        fullname,
        email,
        password  
    })

    const createdUser = await User.findById(user._id).select('-Password')
    // console.log("create user " , createdUser);

    if(!createdUser) {
        return res.status(500).json({
            message : "User not create ! Please try again later "
        })
    }


    // generate access token
    const accessToken  = user.generateAccessToken()

    return res.status(201).
    cookie('accessToken' , accessToken , { 
        httpOnly : true , 
        secure : process.env.NODE_ENV !== 'development',
        // maxAge : 7* 24 * 60 * 60 * 1000,  // 7 days
        sameSite : 'strict',
    }
    ).json({
        message : "User create successfully ",
        createdUser,
        accessToken
    })

        
    } catch (error) {
        console.log("Error in signing up user" , error);
        return res.status(500).json({
            message :"Internal server error"
        })
        
    }
}) 


// login user
export const loginUser = asyncHandler( async (req ,res) => {
    const {email , password} = req.body ;
    console.log("user login" , req.body);
    

    try {
        if ([email , password].some((field) => typeof field !== 'string' || field.trim() === '')) {
            return res.status(400).json({
                message  : "All fields are required"
            })
        }

        // check user exist or not 
        const existUser = await User.findOne({email})
        if(!existUser) {
            return res.status(400).json({
                message : "User not found ! Please sinup first"
            })
        }

        // check password is correct or not 
        const isPasswordMatch = await existUser.isPaaswordCorrect(password)
        if(!isPasswordMatch) {
            return res.status(400).json({
                message : "Invalid credentials ! Please try again"
            })
        }


        // generate access token 
        const accessToken = await existUser.generateAccessToken()

        return res.status(200)
        .cookie('accessToken', accessToken,{
            httpOnly : true,
            secure : process.env.NODE_ENV !== 'development',
            // MaxAge : 7* 24 * 60 *60 *1000 , // 7 days
            sameSite : 'strict'
        })
        .json({
            message : "User Logged in successfully",
            existUser : await User.findById(existUser._id).select('-password')
        })
    } catch (error) {
        console.log("Error in login user", error);
        return res.status(500).json({
            message : "Internal server error"
        })
        
    }
}) 


// logout user
export const logOutUser = asyncHandler( async (req ,res) => {
    res.clearCookie('accessToken',{
        httpOnly : true,
        secure  : process.env.NODE_ENV !== 'development'
    })
    
    return res.status(200).json({
        message : "User Logged out succussfully "
    })
}) 


// update profile 
export const updateProfile = asyncHandler( async (req , res) => {
    try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
        return res.status(400).json({
            message : "Profile Picture is required!"
        })
    }

    const uploadingPic = await uploadOnCloudinary(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId , {
        profilePic : uploadingPic.secure_url},
        {new  : true}
        ).select('-password')

    return res.status(200).json({
        message : "Profile uploaded successfully",
        updatedUser
    })
        
    } catch (error) {
        
    }

})



