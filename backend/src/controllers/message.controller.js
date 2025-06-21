import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from "../models/user.models.js"; // ensure this is imported
import { Message } from '../models/message.model.js';
import cloudinary from '../utils/cloudinary.js';
import { getReceiveSocketId, io } from '../app.js';
// import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const getUsersForSidebar = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select('-password');

        return res.status(200).json(filteredUsers);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


export const getMessages = asyncHandler( async ( req, res) => {
    try {
        const {id : userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or :[
                {senderId :myId  , receiverId  :userToChatId },
                {senderId :userToChatId  , receiverId  :myId }
            ]
        }) 

        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message : "Internal server error!"})
        
    }
})


export const sendMessages = asyncHandler(async(req, res) => {
    try {
        const {text ,image} =  req.body;
        const {id : receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;

        if (image) {
            const uploadimage = await cloudinary.uploader.upload(image);
            imageUrl = uploadimage ? uploadimage.secure_url : null;

        }

        // create new message 
        const newMessage = await Message.create({
            senderId,
            receiverId ,
            text,
            image : imageUrl
        })

        await newMessage.save();

        // todo : realtime functionality goes here  => socket.io

        const receiverSocketId = getReceiveSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        return res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessages controller :", error);
        return res.status(500).json("Internal server error!" );

    }
})