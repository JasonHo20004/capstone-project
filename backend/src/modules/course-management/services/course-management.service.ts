import { CourseManagementRepository } from '@/modules/course-management/repositories/course-management.repository';

export class CourseManagementService {
  private courseRepository = new CourseManagementRepository();

  public async getAllCourses() {
    const courses = await this.courseRepository.findAllCourses();
    return courses.map((course: any) => {
      const avgRating = course.ratings.length > 0
        ? course.ratings.reduce((sum: number, r: any) => sum + r.score, 0) / course.ratings.length
        : 0;

      return {
        ...course,
        averageRating: Number(avgRating.toFixed(2)),
      };
    });
  }

  public async getCourseById(id: string) {
    const course: any = await this.courseRepository.findCourseById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    const avgRating = course.ratings.length > 0
      ? course.ratings.reduce((sum: number, r: any) => sum + r.score, 0) / course.ratings.length
      : 0;

    return {
      ...course,
      averageRating: Number(avgRating.toFixed(2)),
      lessonsCount: course.lessons.length,
      ratingsCount: course.ratings.length,
    };
  }

  public async getCourseLessons(id: string) {
    const course: any = await this.courseRepository.findCourseLessons(id);

    if (!course) {
      throw new Error('Course not found');
    }

    return {
      ...course
    };
  }

  public async getCourseRatings(id: string) {
    const course: any = await this.courseRepository.findCourseRatings(id);

    if (!course) {
      throw new Error('Course not found');
    }

    const avgRating = course.ratings.length > 0
      ? course.ratings.reduce((sum: number, r: any) => sum + r.score, 0) / course.ratings.length
      : 0;

    return {
      courseId: course.id,
      courseTitle: course.title,
      ratings: course.ratings.map((rating: any) => ({
        id: rating.id,
        score: rating.score,
        content: rating.content,
        createdAt: rating.createdAt,
        user: {
          fullName: rating.user.fullName,
          profilePicture: rating.user.profilePicture,
        },
      })),
      ratingsCount: course.ratings.length,
      averageRating: Number(avgRating.toFixed(2)),
    };
  }

  public async getSpecificLesson(courseId: string, lessonId: string) {
    // First verify the course exists
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Get the specific lesson
    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Verify the lesson belongs to the course
    if (lesson.courseId !== courseId) {
      throw new Error('Lesson not found');
    }

    return lesson;
  }

  public async updateLesson(courseId: string, lessonId: string, data: any) {
    // First verify the course exists
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if lesson exists
    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error('Lesson not found');
    }

    // Verify the lesson belongs to the course
    if (existingLesson.courseId !== courseId) {
      throw new Error('Lesson not found');
    }

    // Separate mediaAssets from other data
    const { mediaAssets, ...lessonData } = data;

    // Build update data
    const updateData: any = { ...lessonData };

    // Handle mediaAssets if provided
    if (mediaAssets && Array.isArray(mediaAssets)) {
      updateData.mediaAssets = {
        deleteMany: {}, // Delete all existing mediaAssets
        create: mediaAssets.map((asset: any) => ({
          assetType: asset.assetType,
          assetUrl: asset.assetUrl
        }))
      };
    }

    // Update the lesson
    const updatedLesson = await this.courseRepository.updateLesson(lessonId, updateData);
    return updatedLesson;
  }

  public async deleteLesson(courseId: string, lessonId: string) {
    // First verify the course exists
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if lesson exists
    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error('Lesson not found!');
    }

    // Verify the lesson belongs to the course
    if (existingLesson.courseId !== courseId) {
      throw new Error('Lesson not found');
    }

    // Delete the lesson
    await this.courseRepository.deleteLesson(lessonId);
  }

  public async deleteComment(courseId: string, lessonId: string, commentId: string) {
    // First verify the course exists
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Verify the lesson exists
    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Verify the lesson belongs to the course
    if (lesson.courseId !== courseId) {
      throw new Error('Lesson not found');
    }

    // Get the comment to verify it exists and belongs to the lesson
    const comment = await this.courseRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Verify the comment belongs to the lesson
    if (comment.lessonId !== lessonId) {
      throw new Error('Comment not found');
    }

    // Delete the comment
    await this.courseRepository.deleteComment(commentId);
  }

  public async updateCourse(id: string, data: any) {
    // Check if course exists
    const existingCourse = await this.courseRepository.findCourseById(id);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    const updatedCourse = await this.courseRepository.updateCourse(id, data);

    return {
      ...updatedCourse,
      price: Number(updatedCourse.price),
    };
  }

  public async deleteCourse(id: string) {
    // Check if course exists
    const existingCourse = await this.courseRepository.findCourseById(id);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    // Delete the course (cascade deletes will handle related data)
    await this.courseRepository.deleteCourse(id);
  }

  public async uploadLessonVideo(courseId: string, lessonId: string, videoUrl: string) {
    // Verify the course exists
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Verify the lesson exists and belongs to the course
    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    if (lesson.courseId !== courseId) {
      throw new Error('Lesson not found');
    }

    // Delete all existing VIDEO mediaAssets for this lesson first
    await this.courseRepository.deleteMediaAssetsByLessonId(lessonId, 'VIDEO');

    // Create new media asset record
    const mediaAsset = await this.courseRepository.createMediaAsset({
      assetType: 'VIDEO',
      assetUrl: videoUrl,
      lessonId: lessonId
    });

    return {
      url: mediaAsset.assetUrl,
      id: mediaAsset.id
    };
  }
}
