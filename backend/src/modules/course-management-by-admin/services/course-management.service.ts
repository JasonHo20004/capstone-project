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
      throw new Error("Khóa học không tồn tại");
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
      throw new Error("Khóa học không tồn tại");
    }

    return {
      ...course,
      lessonsCount: course.lessons.length,
    };
  }

  public async getCourseRatings(id: string) {
    const course: any = await this.courseRepository.findCourseRatings(id);

    if (!course) {
      throw new Error("Khóa học không tồn tại");
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
      throw new Error("Khóa học không tồn tại");
    }

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Bài giảng không tồn tại");
    }

    if (lesson.courseId !== courseId) {
      throw new Error("Bài giảng không tồn tại");
    }

    return lesson;
  }

  public async updateLesson(courseId: string, lessonId: string, data: any) {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Khóa học không tồn tại");
    }

    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error("Bài giảng không tồn tại");
    }

    if (existingLesson.courseId !== courseId) {
      throw new Error("Bài giảng không tồn tại");
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
      throw new Error("Khóa học không tồn tại");
    }

    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error("Bài giảng không tồn tại");
    }

    if (existingLesson.courseId !== courseId) {
      throw new Error("Bài giảng không tồn tại");
    }

    // Delete the lesson
    await this.courseRepository.deleteLesson(lessonId);
  }

  public async deleteComment(
    courseId: string,
    lessonId: string,
    commentId: string
  ) {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Khóa học không tồn tại");
    }

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Bài giảng không tồn tại");
    }

    if (lesson.courseId !== courseId) {
      throw new Error("Bài giảng không tồn tại");
    }

    const comment = await this.courseRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error("Bình luận không tồn tại");
    }

    if (comment.lessonId !== lessonId) {
      throw new Error("Bình luận không tồn tại");
    }

    await this.courseRepository.deleteComment(commentId);
  }

  public async updateCourse(id: string, data: any) {
    const existingCourse = await this.courseRepository.findCourseById(id);
    if (!existingCourse) {
      throw new Error("Khóa học không tồn tại");
    }

    const updatedCourse = await this.courseRepository.updateCourse(id, data);

    return {
      ...updatedCourse,
    };
  }

  public async deleteCourse(id: string) {
    const existingCourse = await this.courseRepository.findCourseById(id);
    if (!existingCourse) {
      throw new Error("Khóa học không tồn tại");
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
      throw new Error("Khóa học không tồn tại");
    }

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Bài giảng không tồn tại");
    }

    if (lesson.courseId !== courseId) {
      throw new Error("Bài giảng không tồn tại");
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