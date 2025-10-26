# Course Management API Documentation

This document describes the backend API for managing courses, lessons, and tests in the e-learning platform.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)

## Overview

The Course Management API allows Course Sellers to:
- Create and manage courses
- Upload lecture videos to lessons
- Create final tests with questions
- Publish courses after completion

## Prerequisites

### Environment Variables
Before running the application, configure these environment variables in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/capstone_db"

# AWS S3 Configuration for video uploads
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET_NAME="capstone-videos"

# JWT Configuration
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
```

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Prisma migrations:**
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

3. **Configure AWS S3:**
   - Create an S3 bucket for storing videos
   - Configure IAM user with S3 permissions
   - Add credentials to `.env` file

## Architecture

### Module Structure
```
backend/src/
├── modules/
│   ├── courses/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dtos/
│   │   └── routes/
│   └── tests/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── dtos/
│       └── routes/
├── middlewares/
│   ├── upload.ts (S3 file upload)
│   ├── auth.middleware.ts
│   └── validations.middleware.ts
```

### Data Models

#### Course Model
- `id` (UUID): Unique identifier
- `title` (string): Course name
- `description` (string): Full description
- `shortDescription` (string): Brief description
- `price` (decimal): Course price
- `category` (string): Course category
- `courseLevel` (enum): A1, A2, B1, B2, C1, C2
- `status` (enum): DRAFT, PUBLISHED, PENDING, etc.
- `courseSellerId` (UUID): Owner of the course

#### Lesson Model
- `id` (UUID): Unique identifier
- `title` (string): Lesson title
- `description` (string): Lesson description
- `videoUrl` (string): S3 URL of the video
- `lessonOrder` (number): Order in the course
- `durationInSeconds` (number): Video duration
- `courseId` (UUID): Parent course

#### Test Model
- `id` (UUID): Unique identifier
- `title` (string): Test name
- `durationInMinutes` (number): Time limit
- `maxAttempts` (number): Maximum attempts allowed
- `testType` (enum): SUPPLEMENTARY or FINAL
- Linked to Course via `CourseTest` junction table

## API Endpoints

### 1. Create Course
Create a new course in DRAFT status.

**Endpoint:** `POST /api/v1/courses`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript fundamentals",
  "shortDescription": "A beginner-friendly JS course",
  "price": 49.99,
  "category": "Programming",
  "courseLevel": "BEGINNER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "uuid",
    "title": "Introduction to JavaScript",
    "status": "DRAFT",
    ...
  }
}
```

### 2. Create Lesson with Video Upload
Upload a video and create a lesson for a course.

**Endpoint:** `POST /api/v1/:courseId/lessons`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (form-data):**
- `title`: "Introduction to Variables"
- `description`: "Learn about variables in JavaScript"
- `lessonOrder`: 1
- `durationInSeconds`: 300
- `video`: (file) - Video file (mp4, mov, avi, webm)

**Response:**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "uuid",
    "title": "Introduction to Variables",
    "videoUrl": "https://s3.amazonaws.com/bucket/courses/1234567890-video.mp4",
    ...
  }
}
```

### 3. Create Test
Create a test for a course.

**Endpoint:** `POST /api/v1/courses/:courseId/tests`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Final Assessment",
  "durationInMinutes": 30,
  "maxAttempts": 3,
  "testType": "FINAL",
  "englishTestTypeId": "uuid-of-test-type"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {
    "id": "uuid",
    "title": "Final Assessment",
    ...
  }
}
```

### 4. Add Question to Test

**Endpoint:** `POST /api/v1/tests/:testId/questions`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body (Multiple Choice):**
```json
{
  "questionText": "What is the correct syntax for declaring a variable?",
  "questionType": "MULTIPLE_CHOICE",
  "options": [
    "var name;",
    "variable name;",
    "v name;"
  ],
  "correctAnswerIndex": 0,
  "questionOrder": 1
}
```

**Request Body (Essay):**
```json
{
  "questionText": "Explain the concept of closures in JavaScript.",
  "questionType": "ESSAY",
  "correctAnswer": "Closures are functions that have access to outer variables.",
  "wordLimit": 500,
  "questionOrder": 2
}
```

### 5. Publish Course
Publish a course after it's complete.

**Endpoint:** `PUT /api/v1/courses/:courseId/publish`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Course published successfully",
  "data": {
    "id": "uuid",
    "status": "PUBLISHED",
    ...
  }
}
```

**Note:** This endpoint will fail if the course doesn't have a final test with `testType: "FINAL"`.

## Use Case 1: Create New Course

### Main Flow
1. Course Seller creates a new course using `POST /api/v1/courses`
   - Enters course name, description, price, category
   - Course is created with `DRAFT` status

2. Course Seller adds lessons using `POST /api/v1/:courseId/lessons`
   - Uploads video files via multipart/form-data
   - Enters description for each lesson
   - Videos are uploaded to S3

3. Course Seller creates a final test using `POST /api/v1/courses/:courseId/tests`
   - Sets test parameters (time limit, attempts)
   - Adds questions using `POST /api/v1/tests/:testId/questions`

4. Course Seller publishes using `PUT /api/v1/courses/:courseId/publish`
   - System checks for final test
   - Updates status to `PUBLISHED`

### Alternate Flow
- Course can be saved as `DRAFT` without publishing
- Multiple supplementary tests can be added

### Exception Flows
- If course name is blank → "Please enter the course name"
- If video upload fails → "Could not upload video, please try again"
- If publishing without final test → "Course content is incomplete for publication"

## Use Case 2: Create Final Test

### Main Flow
1. Course Seller creates test with basic info
2. Adds questions to the test
3. Saves the test

### Alternate Flow
- Can add multiple questions before saving
- Can delete or edit questions

### Exception Flows
- If basic info is blank → "Please fill in all basic information"
- If answer format invalid → "Invalid answer format, please re-enter"
- If save fails → "Could not save question, please try again"

## Service Logic Details

### CourseService.publishCourse()
```typescript
public async publishCourse(courseId: string): Promise<Course> {
  // Find the course
  const course = await this.courseRepository.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Check if a test with TestType.FINAL exists
  const hasFinalTest = await this.courseRepository.checkHasFinalTest(courseId);
  
  if (!hasFinalTest) {
    throw new Error('Course content is incomplete for publication. A final test is required.');
  }

  // Update course status to PUBLISHED
  return this.courseRepository.updateStatus(courseId, 'PUBLISHED');
}
```

### LessonService.createLesson()
```typescript
public async createLesson(data: {
  courseId: string;
  title: string;
  videoUrl?: string;
  // ... other fields
}): Promise<Lesson> {
  // Check if course exists
  const course = await this.courseRepository.findById(data.courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Handle the case where req.file is missing
  if (data.videoUrl === undefined) {
    throw new Error('Could not upload video, please try again');
  }

  return this.lessonRepository.create(data);
}
```

## Error Handling

All endpoints use try-catch blocks and pass errors to a global error handler:

```typescript
try {
  // Service logic
} catch (error) {
  next(error);
}
```

## File Upload Middleware

The `upload.ts` middleware configures multer with AWS S3:

```typescript
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `courses/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
```

## Testing the API

1. **Create a Course:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/courses \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Course",
       "description": "Test Description",
       "price": 29.99
     }'
   ```

2. **Upload a Lesson:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/COURSE_ID/lessons \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "title=Lesson 1" \
     -F "description=Description" \
     -F "video=@/path/to/video.mp4"
   ```

3. **Create a Test:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/courses/COURSE_ID/tests \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Final Test",
       "durationInMinutes": 30,
       "maxAttempts": 3,
       "testType": "FINAL",
       "englishTestTypeId": "ENGLISH_TEST_TYPE_UUID"
     }'
   ```

## Notes

- All routes require authentication via JWT
- Only `COURSESELLER` and `ADMINISTRATOR` roles can access these endpoints
- Video files are limited to 100MB
- Videos are stored in S3 with public-read access
- Course must have a final test before it can be published

