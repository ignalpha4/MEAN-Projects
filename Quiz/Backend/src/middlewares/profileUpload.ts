import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: './src/uploads',

  filename: function(req:any, file:any, cb:any) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, 
}).single('profileImage');


export default upload;