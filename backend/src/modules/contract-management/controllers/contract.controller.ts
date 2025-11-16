import type { Request, Response } from 'express';
import { ContractManagementService } from '@/modules/contract-management/services/contract.service';
import type {
  CreateContractInput as ContractCreateInput,
  RenewContractInput as ContractRenewInput,
  UpdateContractStatusInput as ContractStatusInput,
  SendNotificationInput as ContractNotificationInput,
  GetContractHistoryInput as ContractHistoryInput,
  LockSellerInput as ContractLockInput
} from '@/modules/contract-management/dtos/contract.dto';

export class ContractManagementController {
  private service = new ContractManagementService();

  public getDashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dashboardData = await this.service.getContractDashboard();
      res.status(200).json({ success: true, message: 'Contract dashboard retrieved successfully', data: dashboardData });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve contract dashboard', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public create = async (req: Request<{}, ContractCreateInput['body'], ContractCreateInput['body']>, res: Response): Promise<void> => {
    try {
      const contractData = req.body;
      const newContract = await this.service.createMonthlyContract({ courseSellerId: contractData.courseSellerId, notes: contractData.notes });
      res.status(201).json({ success: true, message: 'Contract created successfully', data: newContract });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create contract', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public renew = async (req: Request<ContractRenewInput['params'], {}, ContractRenewInput['body']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const renewalData = req.body;
      const renewedContract = await this.service.renewContract({ contractId, notes: renewalData.notes });
      res.status(200).json({ success: true, message: 'Contract renewed successfully', data: renewedContract });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to renew contract', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public sendNotifications = async (req: Request<{}, ContractNotificationInput['body'], ContractNotificationInput['body']>, res: Response): Promise<void> => {
    try {
      const notificationData = req.body;
      const result = await this.service.sendRenewalNotification(notificationData);
      res.status(200).json({ success: true, message: 'Notifications sent successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to send notifications', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public updateStatus = async (req: Request<ContractStatusInput['params'], {}, ContractStatusInput['body']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const { status, notes } = req.body;
      const updatedContract = await this.service.updateContractStatus({ contractId, status, notes: notes });
      res.status(200).json({ success: true, message: 'Contract status updated successfully', data: updatedContract });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update contract status', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public history = async (req: Request<ContractHistoryInput['params'], {}, {}>, res: Response): Promise<void> => {
    try {
      const { sellerId } = req.params;
      const contractHistory = await this.service.getContractHistory(sellerId);
      res.status(200).json({ success: true, message: 'Contract history retrieved successfully', data: contractHistory });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve contract history', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public lockSeller = async (req: Request<ContractLockInput['params']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const result = await this.service.lockSellerAccount(contractId);
      res.status(200).json({ success: true, message: 'Seller account locked successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to lock seller account', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public handleNonRenewal = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.handleNonRenewal();
      res.status(200).json({ success: true, message: 'Non-renewal processing completed', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to process non-renewal', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public sendScheduledNotifications = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.sendScheduledNotifications();
      res.status(200).json({ success: true, message: 'Scheduled notifications sent successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to send scheduled notifications', error: error instanceof Error ? error.message : String(error) });
    }
  };
}