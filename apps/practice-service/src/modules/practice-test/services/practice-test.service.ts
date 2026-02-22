import { databaseService } from "../../../services/database.service.js";
import { CreatePracticeTestDto } from "../models/practice-test.schema.js";
import { GradingContext } from "./grading/grading-context.js";
import { QuestionResult } from "./grading/grading-strategy.interface.js";

export class PracticeTestService {
  public async createTest(data: CreatePracticeTestDto) {
    const prisma = databaseService.getClient();

    // Use Prisma's nested create to build the entire hierarchy in one transaction
    const newTest = await prisma.practiceTest.create({
      data: {
        title: data.title,
        examType: data.examType || "IELTS",
        duration: data.duration,
        status: data.status || "DRAFT",
        sections: {
          create: data.sections.map((section) => ({
            name: section.name,
            orderIndex: section.orderIndex,
            parts: {
              create: section.parts.map((part) => ({
                name: part.name,
                content: part.content,
                mediaUrl: part.mediaUrl,
                orderIndex: part.orderIndex,
                questionGroups: {
                  create: part.questionGroups.map((group) => ({
                    instructions: group.instructions,
                    imageUrls: group.imageUrls || [],
                    orderIndex: group.orderIndex,
                    questions: {
                      create: group.questions.map((question) => ({
                        type: question.type,
                        content: question.content as any,
                        answer: question.answer as any,
                        explanation: question.explanation,
                        orderIndex: question.orderIndex
                      }))
                    }
                  }))
                }
              }))
            }
          }))
        }
      },
      include: {
        sections: {
          include: {
            parts: {
              include: {
                questionGroups: {
                  include: {
                    questions: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return newTest;
  }

  public async getTestById(id: string) {
    const prisma = databaseService.getClient();
    
    // Fetch omitting the answers for student view
    // Since answer is a JSON field, Prisma doesn't easily exclude it within nested includes without custom mapping, 
    // so we will query it and omit it in the controller/service.
    const test = await prisma.practiceTest.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            parts: {
              orderBy: { orderIndex: 'asc' },
              include: {
                questionGroups: {
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    questions: {
                      orderBy: { orderIndex: 'asc' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!test) {
      throw new Error("Practice test not found");
    }

    return test;
  }

  public async getAllTests() {
    const prisma = databaseService.getClient();
    return await prisma.practiceTest.findMany({
      select: {
        id: true,
        title: true,
        examType: true,
        status: true,
        duration: true,
        createdAt: true,
        updatedAt: true
        // Omit nested questions for summary view
      }
    });
  }

  public async gradeTest(testId: string, submissions: Record<string, any>) {
    const prisma = databaseService.getClient();
    
    // Fetch test WITH answers for grading
    const test = await prisma.practiceTest.findUnique({
      where: { id: testId },
      include: {
        sections: {
          include: {
            parts: {
              include: {
                questionGroups: {
                  include: {
                    questions: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!test) throw new Error("Test not found");

    const results: QuestionResult[] = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    // Iterate through all questions to grade them globally
    test.sections.forEach(section => {
      section.parts.forEach(part => {
        part.questionGroups.forEach(group => {
          group.questions.forEach(question => {
            const studentAnswer = submissions[question.id];
            
            // Look up the strategy dynamically based on QuestionType
            const strategy = GradingContext.getStrategy(question.type);
            const score = strategy.evaluate(question.answer, studentAnswer);
            
            totalScore += score;
            
            // Assume 1 point per question broadly unless GAP_FILL defines multiple keys
            let qMaxScore = 1; 
            if (question.type === "GAP_FILL" && question.answer && typeof question.answer === 'object') {
              qMaxScore = Object.keys(question.answer).length;
            }
            maxPossibleScore += qMaxScore;

            results.push({
              questionId: question.id,
              isCorrect: score === qMaxScore,
              score,
              studentAnswer: studentAnswer || null,
              explanation: question.explanation || undefined
            });
          });
        });
      });
    });

    return {
      testId: test.id,
      totalScore,
      maxPossibleScore,
      percentage: Math.round((totalScore / maxPossibleScore) * 100) || 0,
      detail: results
    };
  }
}

export const practiceTestService = new PracticeTestService();
