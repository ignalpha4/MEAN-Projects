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
  fileFilter: function(req:any, file:any, cb:any) {
    checkFileType(file, cb);
  }
}).single('profileImage');


function checkFileType(file:any, cb:any) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

export default upload;