import { Router } from "express";
import { StudentController } from "@/modules/student-learning/controllers/student.controller";
import { validate } from "@/middlewares/validations.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { optionalAuthMiddleware } from "@/middlewares/optionalAuth.middleware";
import {
  getLessonForPlayerDTO,
  getCourseSyllabusDTO,
  getCourseContextDTO,
  getLessonCommentsDTO,
  createLessonCommentDTO,
  getCourseRatingsDTO,
  createCourseRatingDTO,
  getEnrolledCoursesDTO,
  markLessonCompleteDTO,
} from "@/modules/student-learning/dtos/student.dto";

const router = Router();
const studentController = new StudentController();


router.get("/courses/:courseId/ratings",optionalAuthMiddleware,validate(getCourseRatingsDTO),studentController.getCourseRatings);

router.use(authMiddleware);

/*
 * Get user's enrolled courses
 */
router.get("/my-courses",validate(getEnrolledCoursesDTO),studentController.getMyEnrolledCourses);

/*
 * Get course syllabus (structured tree of lessons)
 */
router.get("/courses/:courseId/syllabus",validate(getCourseSyllabusDTO),studentController.getCourseSyllabus);

/*
 * Get comprehensive course context (overview, progress, syllabus)
 */
router.get("/courses/:courseId/context",validate(getCourseContextDTO),studentController.getCourseContext);

/**
 * Get lesson details for the lesson player (enrolled students only)
 */
router.get("/courses/:courseId/lessons/:lessonId",validate(getLessonForPlayerDTO),studentController.getLessonForPlayer);

/*
 * Mark a lesson as completed
 */
router.post("/courses/:courseId/lessons/:lessonId/complete",validate(markLessonCompleteDTO),studentController.markLessonComplete);

/*
 * Get lesson comments with pagination
 */
router.get("/courses/:courseId/lessons/:lessonId/comments",validate(getLessonCommentsDTO),studentController.getLessonComments);

/*
 * Create a comment on a lesson
 */
router.post("/courses/:courseId/lessons/:lessonId/comments",validate(createLessonCommentDTO),studentController.createLessonComment);

/*
 * Create a rating for a course (verified purchasers only)
 */
router.post("/courses/:courseId/ratings",validate(createCourseRatingDTO),studentController.createCourseRating);

export default router;

