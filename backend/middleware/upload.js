// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads'); 

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {

    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|ppt|pptx|xlsx|xls|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); 
  } else {
    cb('Error: Only PDF, Word, Text, PowerPoint, Excel, and Image files are allowed!'); 
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, 
});

module.exports = upload;