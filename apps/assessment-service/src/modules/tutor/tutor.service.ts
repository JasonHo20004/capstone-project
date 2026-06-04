import { databaseService } from "../../services/database.service.js";

export class TutorService {

  /**
   * Get or create a TutorSession for a specific question.
   * Returns session with existing messages if it already exists.
   */
  public async getOrCreateSession(practiceSessionId: string, questionId: string, userId: string) {
    const prisma = databaseService.getClient();

    // Try to find existing session
    let session = await prisma.tutorSession.findUnique({
      where: {
        practiceSessionId_questionId_userId: {
          practiceSessionId,
          questionId,
          userId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Create if not exists
    if (!session) {
      session = await prisma.tutorSession.create({
        data: {
          practiceSessionId,
          questionId,
          userId,
        },
        include: {
          messages: true,
        },
      });
    }

    return session;
  }

  /**
   * Add a message to a TutorSession.
   */
  public async addMessage(tutorSessionId: string, role: string, content: string) {
    const prisma = databaseService.getClient();

    const message = await prisma.tutorMessage.create({
      data: {
        tutorSessionId,
        role,
        content,
      },
    });

    // Touch updatedAt on session
    await prisma.tutorSession.update({
      where: { id: tutorSessionId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  /**
   * Get all tutor sessions for a practice session (result page).
   * Returns sessions with message counts to show which questions have AI explanations.
   */
  public async getSessionsByPractice(practiceSessionId: string, userId: string) {
    const prisma = databaseService.getClient();

    return await prisma.tutorSession.findMany({
      where: { practiceSessionId, userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * Get a single session with all messages.
   */
  public async getSession(sessionId: string) {
    const prisma = databaseService.getClient();

    const session = await prisma.tutorSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) throw new Error("Tutor session not found");
    return session;
  }
}

export const tutorService = new TutorService();
