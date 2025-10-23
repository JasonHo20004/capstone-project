import type { Request, Response } from 'express';
import { AdminService } from '@/modules/admin/services/admin.service';
import type { ApproveCourseSellerApplicationInput } from '../dtos/courseSeller.dto';
import type {
  CreateContractInput as ContractCreateInput,
  RenewContractInput as ContractRenewInput,
  UpdateContractStatusInput as ContractStatusInput,
  SendNotificationInput as ContractNotificationInput,
  GetContractHistoryInput as ContractHistoryInput,
  LockSellerInput as ContractLockInput
} from '../dtos/contract.dto';

export class AdminController {
  private adminService = new AdminService();  

  public  getAllUsers= async(_req: Request, res: Response):Promise<void> =>{
      try {
        const userProfiles = await this.adminService.getAllUsers();
        
        res.status(200).json({
          success: true,
          message: 'Get all user profiles successfully',
          data: userProfiles,
          count: userProfiles.length
        });
  
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to get user profiles',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  public upgradeToCourseSeller= async(req: Request<ApproveCourseSellerApplicationInput['params'],{},ApproveCourseSellerApplicationInput['body']>, res: Response):Promise<void> =>{
    try {
      const userId = req.params.userId;
      const status = req.params.status;
      const rejectionReason = req.body.rejectionReason;
      const message = req.body.message;
      const upgradedCourseSeller = await this.adminService.upgradeToCourseSeller(userId,status, rejectionReason, message);
      
      res.status(200).json({
        success: true,
        message: 'Approve successfully',
        data: upgradedCourseSeller,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to approve user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Contract Management Controllers
  public getContractDashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dashboardData = await this.adminService.getContractDashboard();
      
      res.status(200).json({
        success: true,
        message: 'Contract dashboard retrieved successfully',
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve contract dashboard',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public createContract = async (req: Request<{}, ContractCreateInput['body'], ContractCreateInput['body']>, res: Response): Promise<void> => {
    try {
      const contractData = req.body;
      const newContract = await this.adminService.createMonthlyContract({
        courseSellerId: contractData.courseSellerId,
        notes: contractData.notes
      });
      
      res.status(201).json({
        success: true,
        message: 'Contract created successfully',
        data: newContract
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create contract',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public renewContract = async (req: Request<ContractRenewInput['params'], {}, ContractRenewInput['body']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const renewalData = req.body;
      
      const renewedContract = await this.adminService.renewContract({
        contractId,
        notes: renewalData.notes
      });
      
      res.status(200).json({
        success: true,
        message: 'Contract renewed successfully',
        data: renewedContract
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to renew contract',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public sendNotifications = async (req: Request<{}, ContractNotificationInput['body'], ContractNotificationInput['body']>, res: Response): Promise<void> => {
    try {
      const notificationData = req.body;
      const result = await this.adminService.sendRenewalNotification(notificationData);
      
      res.status(200).json({
        success: true,
        message: 'Notifications sent successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send notifications',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public updateContractStatus = async (req: Request<ContractStatusInput['params'], {}, ContractStatusInput['body']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const { status, notes } = req.body;
      
      const updatedContract = await this.adminService.updateContractStatus({
        contractId,
        status,
        notes: notes
      });
      
      res.status(200).json({
        success: true,
        message: 'Contract status updated successfully',
        data: updatedContract
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update contract status',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getContractHistory = async (req: Request<ContractHistoryInput['params'], {}, {}>, res: Response): Promise<void> => {
    try {
      const { sellerId } = req.params;
      const contractHistory = await this.adminService.getContractHistory(sellerId);
      
      res.status(200).json({
        success: true,
        message: 'Contract history retrieved successfully',
        data: contractHistory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve contract history',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public lockSeller = async (req: Request<ContractLockInput['params']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const result = await this.adminService.lockSellerAccount(contractId);
      
      res.status(200).json({
        success: true,
        message: 'Seller account locked successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to lock seller account',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public handleNonRenewal = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.adminService.handleNonRenewal();
      
      res.status(200).json({
        success: true,
        message: 'Non-renewal processing completed',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to process non-renewal',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public sendScheduledNotifications = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.adminService.sendScheduledNotifications();
      
      res.status(200).json({
        success: true,
        message: 'Scheduled notifications sent successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send scheduled notifications',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  
}