import { PracticeSessionRepository } from "@/modules/practice_sessions/repositories/practiceSession.repository";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { TestRepository } from "@/modules/tests/repositories/test.repository";
import { SectionRepository } from "@/modules/tests/repositories/section.repository";
import type { CreateSessionResponse } from "@/modules/practice_sessions/dtos/practiceSession.dto";

export class PracticeSessionService {
  private practiceSessionRepository = new PracticeSessionRepository();
  private userRepository = new UserRepository();
  private testRepository = new TestRepository();
  private sectionRepository = new SectionRepository();

  public async startSession(
    userId: string,
    testId: string,
    sectionIds: string[]
  ): Promise<CreateSessionResponse> {
    const existingUser = await this.userRepository.findUserById(userId);
    let sectionsToPractice: string[] = [];
    if (!existingUser) {
      throw Error("User is not exist");
    }

    const existingTest = await this.testRepository.findById(testId);
    if (!existingTest) {
      throw Error("Course is not exist ");
    }
    const existingSession =
      await this.practiceSessionRepository.findOnGoingSession({
        userId,
        testId,
      });

    if (existingSession) {
      throw Error("This session is ongoing!");
    }
    if ( sectionIds&&sectionIds.length > 0) {
      const sectionsInTest =
        await this.sectionRepository.findSectionByIds_InTest(
          testId,
          sectionIds
        );

      if (sectionsInTest.length !== sectionIds.length) {
        throw Error("Having some section is not available in test");
      }

  
      sectionsToPractice = sectionIds;
    } else {
      const allSections = await this.sectionRepository.findSectionByTest(
        testId
      );
      sectionsToPractice = allSections.map((section) => section.id);
    }

    const newSession = await this.practiceSessionRepository.createSession({
      userId,
      testId,
      selectedSections:sectionsToPractice,
    });
    return newSession;
  }
}
