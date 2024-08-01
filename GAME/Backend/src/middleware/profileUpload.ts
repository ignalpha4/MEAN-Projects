import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: './src/uploads',

  filename: function(req:any, file:any, cb:any) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).single('profileImage');




export default upload;