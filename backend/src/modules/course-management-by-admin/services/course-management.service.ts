import { CourseManagementRepository } from "@/modules/course-management-by-admin/repositories/course-management.repository";
import { calculateAverageRating } from "@/utils/admin";

export class CourseManagementService {
  private courseRepository = new CourseManagementRepository();

  public async getAllCourses() {
    const courses = await this.courseRepository.findAllCourses();
    return courses.map((course: any) => {
      return {
        ...course,
        averageRating: calculateAverageRating(course.ratings),
      };
    });
  }

  public async getCourseById(id: string) {
    const course: any = await this.courseRepository.findCourseById(id);

    if (!course) {
      throw new Error("Course not found");
    }

    return {
      ...course,
      averageRating: calculateAverageRating(course.ratings),
      lessonsCount: course.lessons.length,
      ratingsCount: course.ratings.length,
    };
  }

  public async getCourseLessons(id: string) {
    const course: any = await this.courseRepository.findCourseLessons(id);

    if (!course) {
      throw new Error("Course not found");
    }

    return {
      ...course,
      lessonsCount: course.lessons.length,
    };
  }

  public async getCourseRatings(id: string) {
    const course: any = await this.courseRepository.findCourseRatings(id);

    if (!course) {
      throw new Error("Course not found");
    }

    return {
      ...course,
      ratingsCount: course.ratings.length,
      averageRating: calculateAverageRating(course.ratings),
    };
  }

  public async getSpecificLesson(courseId: string, lessonId: string) {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    if (lesson.courseId !== courseId) {
      throw new Error("Lesson not found");
    }

    return lesson;
  }

  public async updateLesson(courseId: string, lessonId: string, data: any) {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error("Lesson not found");
    }

    if (existingLesson.courseId !== courseId) {
      throw new Error("Lesson not found");
    }

    const { mediaAssets, ...lessonData } = data;

    const updatedLesson = await this.courseRepository.updateLesson(
      lessonId,
      lessonData
    );

    return updatedLesson;
  }

  public async deleteLesson(courseId: string, lessonId: string) {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error("Lesson not found!");
    }

    if (existingLesson.courseId !== courseId) {
      throw new Error("Lesson not found");
    }

    // Delete the lesson
    await this.courseRepository.deleteLesson(lessonId);
  }

  public async deleteComment(
    courseId: string,
    lessonId: string,
    commentId: string
  ) {
    // First verify the course exists
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    if (lesson.courseId !== courseId) {
      throw new Error("Lesson not found");
    }

    const comment = await this.courseRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.lessonId !== lessonId) {
      throw new Error("Comment not found");
    }

    await this.courseRepository.deleteComment(commentId);
  }

  public async updateCourse(id: string, data: any) {
    const existingCourse = await this.courseRepository.findCourseById(id);
    if (!existingCourse) {
      throw new Error("Course not found");
    }

    const updatedCourse = await this.courseRepository.updateCourse(id, data);

    return {
      ...updatedCourse,
    };
  }

  public async deleteCourse(id: string) {
    const existingCourse = await this.courseRepository.findCourseById(id);
    if (!existingCourse) {
      throw new Error("Course not found");
    }

    await this.courseRepository.deleteCourse(id);
  }

  public async uploadLessonVideo(
    courseId: string,
    lessonId: string,
    videoUrl: string
  ) {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    if (lesson.courseId !== courseId) {
      throw new Error("Lesson not found");
    }

    const existingVideo = lesson.mediaAssets?.find(
      (asset: any) => asset.assetType === "VIDEO"
    );

    let mediaAsset;

    if (existingVideo) {
      mediaAsset = await this.courseRepository.updateMediaAsset(
        existingVideo.id,
        { assetUrl: videoUrl }
      );
    } else {
      mediaAsset = await this.courseRepository.createMediaAsset({
        assetType: "VIDEO",
        assetUrl: videoUrl,
        lessonId: lessonId,
      });
    }

    return {
      ...mediaAsset,
    };
  }
}
