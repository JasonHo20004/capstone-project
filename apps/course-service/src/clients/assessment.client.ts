// =============================================================================
// Assessment Client - HTTP client to communicate with Assessment Service
// =============================================================================

const ASSESSMENT_SERVICE_URL = process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003";

export interface AssessmentTest {
  id: string;
  sellerId: string;
  title: string;
}

export class AssessmentClient {
  private static instance: AssessmentClient;

  public static getInstance(): AssessmentClient {
    if (!AssessmentClient.instance) {
      AssessmentClient.instance = new AssessmentClient();
    }
    return AssessmentClient.instance;
  }

  async getTest(testId: string, sellerId: string): Promise<AssessmentTest | null> {
    try {
      const response = await fetch(
        `${ASSESSMENT_SERVICE_URL}/api/tests/internal/${testId}?sellerId=${sellerId}`,
        { headers: { "x-internal-service": "course-service" } }
      );
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Assessment service error: ${response.status}`);
      const data = await response.json() as { data: AssessmentTest };
      return data.data;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Assessment service error:")) {
        throw error;
      }
      console.error("[Course Service] Error fetching test:", error);
      throw error;
    }
  }

  /**
   * Record that a course uses a test. Best-effort — used to keep the
   * `course_tests` join table in sync with `Course.finalTestId`. The link is
   * what `_count.courseTests` on the seller's test list reads from.
   */
  async linkCourseTest(testId: string, courseId: string, sellerId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${ASSESSMENT_SERVICE_URL}/api/tests/internal/${testId}/course-link?courseId=${courseId}&sellerId=${sellerId}`,
        { method: "POST", headers: { "x-internal-service": "course-service" } }
      );
      if (!response.ok) throw new Error(`Assessment service error: ${response.status}`);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Assessment service error:")) {
        throw error;
      }
      console.error("[Course Service] Error linking course-test:", error);
      throw error;
    }
  }

  /** Remove the course↔test link record. Idempotent. */
  async unlinkCourseTest(testId: string, courseId: string, sellerId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${ASSESSMENT_SERVICE_URL}/api/tests/internal/${testId}/course-link?courseId=${courseId}&sellerId=${sellerId}`,
        { method: "DELETE", headers: { "x-internal-service": "course-service" } }
      );
      if (!response.ok && response.status !== 404) {
        throw new Error(`Assessment service error: ${response.status}`);
      }
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Assessment service error:")) {
        throw error;
      }
      console.error("[Course Service] Error unlinking course-test:", error);
      throw error;
    }
  }

  /**
   * Hard-delete a test row. Used when a seller overwrites their course's final
   * test — the old test row would otherwise linger. Returns true if deleted,
   * false if test didn't exist; throws on 403 / network.
   */
  async deleteTest(testId: string, sellerId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${ASSESSMENT_SERVICE_URL}/api/tests/internal/${testId}?sellerId=${sellerId}`,
        { method: "DELETE", headers: { "x-internal-service": "course-service" } }
      );
      if (response.status === 404) return false;
      if (!response.ok) throw new Error(`Assessment service error: ${response.status}`);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Assessment service error:")) {
        throw error;
      }
      console.error("[Course Service] Error deleting test:", error);
      throw error;
    }
  }
}

export const assessmentClient = AssessmentClient.getInstance();
