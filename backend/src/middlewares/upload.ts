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

export const uploadVideoOptional = (req: any, res: any, next: any) => {
  upload.single('video')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next();
      }
      return next(err);
    }
    next();
  });
};


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
export const uploadImages = uploadImageConfig.array('images', 20);

// Optional image upload middleware (similar to uploadVideoOptional)
export const uploadImageOptional = (req: any, res: any, next: any) => {
  uploadImageConfig.single('image')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next();
      }
      return next(err);
    }
    next();
  });
};
// Error handling middleware for upload errors
export const handleUploadError = (err: Error, req: any, res: any, next: any) => {
  // Check for S3 connection errors (network/DNS errors)
  if (err.message && (
    err.message.includes('getaddrinfo') ||
    err.message.includes('EAI_AGAIN') ||
    err.message.includes('ENOTFOUND') ||
    err.message.includes('ECONNREFUSED') ||
    err.message.includes('ETIMEDOUT') ||
    err.message.includes('NetworkError') ||
    err.message.includes('socket hang up')
  )) {
    return res.status(503).json({
      success: false,
      message: 'Không thể kết nối đến dịch vụ lưu trữ file. Vui lòng kiểm tra cấu hình AWS S3 hoặc thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Check for AWS credentials/authentication errors
  if (err.message && (
    err.message.includes('InvalidAccessKeyId') ||
    err.message.includes('SignatureDoesNotMatch') ||
    err.message.includes('AccessDenied') ||
    err.message.includes('InvalidAccessKeyId')
  )) {
    return res.status(503).json({
      success: false,
      message: 'Lỗi xác thực dịch vụ lưu trữ file. Vui lòng kiểm tra cấu hình AWS S3.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Check for S3 bucket errors
  if (err.message && (
    err.message.includes('NoSuchBucket') ||
    err.message.includes('BucketNotFound')
  )) {
    return res.status(503).json({
      success: false,
      message: 'Bucket lưu trữ file không tồn tại. Vui lòng kiểm tra cấu hình AWS S3.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  if (err instanceof multer.MulterError) {
    // Xử lý lỗi quá dung lượng file
    if (err.code === 'LIMIT_FILE_SIZE') {
      // Kiểm tra xem request này là upload video hay ảnh để báo lỗi chính xác
      const message = req.is('multipart/form-data') && req.url.includes('image') 
        ? 'File too large. Maximum size for images is 5MB.'
        : 'File too large. Maximum size is 100MB.';
        
      return res.status(400).json({
        success: false,
        message,
      });
    }
    
    // Xử lý lỗi quá số lượng file cho phép (khi dùng .array)
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Too many files or invalid field name.',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  // Lỗi từ fileFilter (sai định dạng) hoặc các lỗi khác
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Upload failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
  
  next();
};
