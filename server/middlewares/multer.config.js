import multer from 'multer'
import path from 'path'

//file size
const FILE_SIZE_LIMIT = 2 * 1024 * 1024

//allowed file format 
const ALLOWED_FILE_TYPES = [ 
    'image/jpeg',
    'image/png'
]

//configuring storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const uploadFolder = 'uploads/profilePictures' 
        cb(null, uploadFolder)
    },
    filename: (req, file, cb) =>{
        const uniqueSuffix = Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const filename = `${req.userId}-${uniqueSuffix}${fileExtension}`; // Use user ID and timestamp
        cb(null, filename);
    } 
})

const fileFilter = (req, file, cb) => {
    console.log('fileFilter called'); 
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      console.log('Invalid file type'); 
      return cb(new Error('Only image files are allowed'), false); // Reject if file type is not allowed
    }
    console.log('File accepted');
    cb(null, true); // Accept the file
};

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: FILE_SIZE_LIMIT}
})

export default upload