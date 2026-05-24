// =============================================================================
// Module Service - Business logic for course modules
// =============================================================================

import { ModuleRepository } from "../repositories/module.repository.js";
import { CourseRepository } from "../repositories/course.repository.js";
import { identityClient } from "../../../clients/identity.client.js";

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

  /**
   * Block actions by sellers whose profile.isActive=false. Network errors
   * fail-open to avoid blocking writes when identity-service is briefly down.
   */
  private async assertActiveSeller(sellerId: string): Promise<void> {
    const status = await identityClient.getSellerStatus(sellerId);
    if (status === null) return;
    if (!status.hasProfile) {
      throw Object.assign(new Error("You don't have a course-seller profile"), { statusCode: 403 });
    }
    if (!status.active) {
      throw Object.assign(new Error("Your seller account has been deactivated"), { statusCode: 403 });
    }
  }

  async getByCourseId(courseId: string) {
    return await this.moduleRepository.findByCourseId(courseId);
  }

  async getById(id: string) {
    return await this.moduleRepository.findById(id);
  }

  async create(courseId: string, sellerId: string, input: CreateModuleInput) {
    await this.assertActiveSeller(sellerId);

    const course = await this.courseRepository.findById(courseId);
    if (!course) throw Object.assign(new Error("Course not found"), { statusCode: 404 });
    if (course.courseSellerId !== sellerId)
      throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });

    const title = input.title?.trim();
    if (!title) throw Object.assign(new Error("Title is required"), { statusCode: 400 });
    if (title.length > 150)
      throw Object.assign(new Error("Title must be at most 150 characters"), { statusCode: 400 });

    const description = input.description?.trim() || undefined;
    const moduleOrder =
      input.moduleOrder ?? (await this.moduleRepository.count(courseId)) + 1;

    return await this.moduleRepository.create({
      title,
      description,
      moduleOrder,
      courseId,
    });
  }

  async update(moduleId: string, sellerId: string, input: UpdateModuleInput) {
    await this.assertActiveSeller(sellerId);

    const module = await this.moduleRepository.findById(moduleId);
    if (!module) throw Object.assign(new Error("Module not found"), { statusCode: 404 });

    const course = await this.courseRepository.findById(module.courseId);
    if (!course || course.courseSellerId !== sellerId)
      throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });

    const updates: { title?: string; description?: string; moduleOrder?: number } = {};
    if (input.title !== undefined) {
      const trimmed = input.title.trim();
      if (!trimmed)
        throw Object.assign(new Error("Title cannot be empty"), { statusCode: 400 });
      if (trimmed.length > 150)
        throw Object.assign(new Error("Title must be at most 150 characters"), { statusCode: 400 });
      updates.title = trimmed;
    }
    if (input.description !== undefined) updates.description = input.description.trim();
    if (input.moduleOrder !== undefined) {
      if (!Number.isInteger(input.moduleOrder) || input.moduleOrder < 1)
        throw Object.assign(new Error("moduleOrder must be a positive integer"), { statusCode: 400 });
      updates.moduleOrder = input.moduleOrder;
    }

    return await this.moduleRepository.update(moduleId, updates);
  }

  async delete(moduleId: string, sellerId: string) {
    await this.assertActiveSeller(sellerId);

    const module = await this.moduleRepository.findById(moduleId);
    if (!module) throw Object.assign(new Error("Module not found"), { statusCode: 404 });

    const course = await this.courseRepository.findById(module.courseId);
    if (!course || course.courseSellerId !== sellerId)
      throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });

    return await this.moduleRepository.delete(moduleId);
  }
}
