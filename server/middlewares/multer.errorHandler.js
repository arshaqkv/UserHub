import multer from "multer";

const multerErrorHandler = (err, req, res, next) => {
    console.log('multerErrorHandler called');
    if (err instanceof multer.MulterError) {
      // Multer-specific error handling
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size exceeds limit' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    console.log('General error occurred:', err.message); 
    return res.status(400).json({ success: false, message: err.message });
    // Handle general errors
    next(err);
};
   
export default multerErrorHandler;
  