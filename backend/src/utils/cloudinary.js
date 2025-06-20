import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
import exp from "constants";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINART_NAME,
  api_key: process.env.CLOUDINART_API_KEY,
  api_secret: process.env.CLOUDINART_API_SECRET,
});

export default cloudinary;

// export const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const result = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     fs.unlinkSync(localFilePath); // remove file after upload
//     return result;
//   } catch (error) {
//     fs.unlinkSync(localFilePath); // remove file on error
//     return null;
//   }
// };

