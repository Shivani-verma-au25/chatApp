import multer from "multer";
import path from "path";
import fs from "fs";

// create temp uploads folder if not exists
const uploadFolder = "temp/uploads";
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    // const ext = path.extname(file.originalname);
    // const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// // mlter configration 




// const storage = multer.diskStorage({
//     destination : function(req,file , cb){
//         cb( null , './public/temp')
//     },
//     filename : function(req,file ,cb){
//         cb( null , file.originalname)
//     }
// })


// export const upload = multer({
//     storage
// })  