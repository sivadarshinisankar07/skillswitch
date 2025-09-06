// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|zip/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = allowedTypes.test(file.mimetype.toLowerCase());

  if (mimeType || allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDF, Word, and ZIP files are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
