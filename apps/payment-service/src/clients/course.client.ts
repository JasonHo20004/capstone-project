// =============================================================================
// Course Client - Fetches course data from Course Service
// =============================================================================

const COURSE_SERVICE_URL =
  process.env.COURSE_SERVICE_URL || "http://localhost:3002";

export interface CourseInfo {
  id: string;
  title: string;
  price: number;
}

export async function getCourseById(courseId: string): Promise<CourseInfo | null> {
  try {
    const res = await fetch(`${COURSE_SERVICE_URL}/api/courses/${courseId}`);
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data ?? json;
    return {
      id: data.id,
      title: data.title || "Course",
      price: Number(data.price) || 0,
    };
  } catch {
    return null;
  }
}
