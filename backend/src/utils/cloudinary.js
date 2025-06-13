import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINART_NAME, 
        api_key: process.env.CLOUDINART_API_KEY, 
        api_secret:process.env.CLOUDINART_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

export const uploadOnCloudinary = async (filePath) =>{    
    try {

    if(!filePath) {
        console.log("File Path is not provided");
        return null;
    }

    const response = await cloudinary.uploader.upload(filePath,{
            resource_type : 'auto'
        })
        console.log("file uploaded on cloudinary" , response);
        // remove file from local path
        fs.unlinkSync(filePath)
        return response
    } catch (error) {
         console.log("Error uploading file:", error);
        fs.unlinkSync(localFilePath); // Remove temp file if upload fails
        return null;
    }


}