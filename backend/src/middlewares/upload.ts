import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Configure multer to use S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'capstone-videos',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (_req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_req, file, cb) {
      // Generate unique filename with timestamp
      const fileName = `courses/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept video files
    const allowedMimes = [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  },
});

export const uploadVideo = upload.single('video');


// ... (Code khởi tạo s3 giữ nguyên)

// Configure multer for IMAGES
const uploadImageConfig = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'capstone-videos', // Có thể dùng chung bucket
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (_req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_req, file, cb) {
      // Thay đổi folder lưu trữ sang 'images/'
      const fileName = `images/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB cho ảnh (Best Practice)
  },
  fileFilter: (_req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files (JPEG, PNG, WEBP, GIF) are allowed.'));
    }
  },
});

// Export middleware upload image
// Lưu ý: 'image' là tên field trong FormData từ Frontend gửi lên
export const uploadImage = uploadImageConfig.single('image');
// Error handling middleware for upload errors
export const handleUploadError = (err: Error, _req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 100MB.',
      });
    }
    return res.status(400).json({
      message: err.message,
    });
  }
  next(err);
};

