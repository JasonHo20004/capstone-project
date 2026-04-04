// =============================================================================
// Course Client - Fetches course data from Course Service
// =============================================================================

const COURSE_SERVICE_URL =
  process.env.COURSE_SERVICE_URL || "http://localhost:3002";

export interface CourseInfo {
  id: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  courseSellerId?: string;
}

export async function getCourseById(courseId: string): Promise<CourseInfo | null> {
  try {
    const res = await fetch(`${COURSE_SERVICE_URL}/api/courses/${courseId}`);
    if (!res.ok) return null;
    const json = await res.json() as Record<string, any>;
    const data = json?.data ?? json;
    return {
      id: data.id,
      title: data.title || "Course",
      price: Number(data.price) || 0,
      thumbnailUrl: data.thumbnailUrl || undefined,
      courseSellerId: data.courseSellerId || undefined,
    };
  } catch {
    return null;
  }
}
