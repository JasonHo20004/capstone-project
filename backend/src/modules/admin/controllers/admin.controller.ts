import type { Request, Response } from 'express';
import { AdminService } from '@/modules/admin/services/admin.service';
import type { ApproveCourseSellerApplicationInput } from '../dtos/courseSeller.dto';

export class AdminController {
  private adminService = new AdminService();  
  public upgradeToCourseSeller= async(req: Request<ApproveCourseSellerApplicationInput['params'],{},ApproveCourseSellerApplicationInput['body']>, res: Response):Promise<void> =>{
    try {
      const applicationId = req.params.applicationId;
      const status = req.params.status;
      const rejectionReason = req.body.rejectionReason;
      const message = req.body.message;
      const upgradedCourseSeller = await this.adminService.upgradeToCourseSeller(applicationId,status, rejectionReason, message);
      
      res.status(200).json({
        success: true,
        message: 'Chấp nhận thành công',
        data: upgradedCourseSeller,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi chấp nhận người dùng',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  

  
}