import { Router } from "express";
import { CourseManagementController } from "@/modules/course-management-by-admin/controllers/course-management.controller";
import { uploadVideo } from "@/middlewares/upload";

const router = Router();
const courseManagementController = new CourseManagementController();

// Get all courses
router.get("/", courseManagementController.getAllCourses);

// Get course details by ID
router.get("/:id", courseManagementController.getCourseById);

// Update course by ID
router.put("/:id", courseManagementController.updateCourse);

// Delete course by ID
router.delete("/:id", courseManagementController.deleteCourse);

// Get lessons for a course (must be before /:id route)
router.get("/:id/lessons", courseManagementController.getCourseLessons);

// Get a specific lesson in a course
router.get(
  "/:courseId/lessons/:lessonId",
  courseManagementController.getSpecificLesson
);

// Upload video for a lesson
router.post(
  "/:courseId/lessons/:lessonId/upload-video",
  uploadVideo,
  courseManagementController.uploadLessonVideo
);

// Update a specific lesson in a course
router.put(
  "/:courseId/lessons/:lessonId",
  courseManagementController.updateLesson
);

// Delete a specific lesson in a course
router.delete(
  "/:courseId/lessons/:lessonId",
  courseManagementController.deleteLesson
);

// Delete a comment in a lesson
router.delete(
  "/:courseId/lessons/:lessonId/comments/:commentId",
  courseManagementController.deleteComment
);

// Get ratings for a course (must be before /:id route)
router.get("/:id/ratings", courseManagementController.getCourseRatings);

export default router;
