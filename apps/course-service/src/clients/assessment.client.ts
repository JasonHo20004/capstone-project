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
}

export const assessmentClient = AssessmentClient.getInstance();
