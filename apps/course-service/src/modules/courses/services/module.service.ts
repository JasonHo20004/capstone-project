// =============================================================================
// Module Service - Business logic for course modules
// =============================================================================

import { ModuleRepository } from "../repositories/module.repository.js";
import { CourseRepository } from "../repositories/course.repository.js";

export interface CreateModuleInput {
  title: string;
  description?: string;
  moduleOrder?: number;
}

export interface UpdateModuleInput {
  title?: string;
  description?: string;
  moduleOrder?: number;
}

export class ModuleService {
  private moduleRepository = new ModuleRepository();
  private courseRepository = new CourseRepository();

  async getByCourseId(courseId: string) {
    return await this.moduleRepository.findByCourseId(courseId);
  }

  async getById(id: string) {
    return await this.moduleRepository.findById(id);
  }

  async create(courseId: string, sellerId: string, input: CreateModuleInput) {
    // Verify seller owns the course
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.courseSellerId !== sellerId) throw new Error("Unauthorized");

    // Auto-calculate module order if not provided
    const moduleOrder = input.moduleOrder ?? (await this.moduleRepository.count(courseId)) + 1;

    return await this.moduleRepository.create({
      title: input.title,
      description: input.description,
      moduleOrder,
      courseId,
    });
  }

  async update(moduleId: string, sellerId: string, input: UpdateModuleInput) {
    const module = await this.moduleRepository.findById(moduleId);
    if (!module) throw new Error("Module not found");

    const course = await this.courseRepository.findById(module.courseId);
    if (!course || course.courseSellerId !== sellerId) throw new Error("Unauthorized");

    return await this.moduleRepository.update(moduleId, {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.moduleOrder !== undefined && { moduleOrder: input.moduleOrder }),
    });
  }

  async delete(moduleId: string, sellerId: string) {
    const module = await this.moduleRepository.findById(moduleId);
    if (!module) throw new Error("Module not found");

    const course = await this.courseRepository.findById(module.courseId);
    if (!course || course.courseSellerId !== sellerId) throw new Error("Unauthorized");

    return await this.moduleRepository.delete(moduleId);
  }
}
