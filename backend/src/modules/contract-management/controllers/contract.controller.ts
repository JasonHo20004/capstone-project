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
      res.status(200).json({ success: true, message: 'Trang tổng quan hợp đồng đã được lấy thành công', data: dashboardData });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lấy trang tổng quan hợp đồng', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public create = async (req: Request<{}, ContractCreateInput['body'], ContractCreateInput['body']>, res: Response): Promise<void> => {
    try {
      const contractData = req.body;
      const newContract = await this.service.createMonthlyContract({ courseSellerId: contractData.courseSellerId, notes: contractData.notes });
      res.status(201).json({ success: true, message: 'Hợp đồng tháng mới đã được tạo thành công', data: newContract });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi tạo hợp đồng tháng mới', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public renew = async (req: Request<ContractRenewInput['params'], {}, ContractRenewInput['body']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const renewalData = req.body;
      const renewedContract = await this.service.renewContract({ contractId, notes: renewalData.notes });
      res.status(200).json({ success: true, message: 'Hợp đồng tháng đã được gia hạn thành công', data: renewedContract });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi gia hạn hợp đồng tháng', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public sendNotifications = async (req: Request<{}, ContractNotificationInput['body'], ContractNotificationInput['body']>, res: Response): Promise<void> => {
    try {
      const notificationData = req.body;
      const result = await this.service.sendRenewalNotification(notificationData);
      res.status(200).json({ success: true, message: 'Thông báo gia hạn hợp đồng đã được gửi thành công', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi gửi thông báo gia hạn hợp đồng', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public updateStatus = async (req: Request<ContractStatusInput['params'], {}, ContractStatusInput['body']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const { status, notes } = req.body;
      const updatedContract = await this.service.updateContractStatus({ contractId, status, notes: notes });
      res.status(200).json({ success: true, message: 'Trạng thái hợp đồng đã được cập nhật thành công', data: updatedContract });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái hợp đồng', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public history = async (req: Request<ContractHistoryInput['params'], {}, {}>, res: Response): Promise<void> => {
    try {
      const { sellerId } = req.params;
      const contractHistory = await this.service.getContractHistory(sellerId);
      res.status(200).json({ success: true, message: 'Lịch sử hợp đồng đã được lấy thành công', data: contractHistory });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử hợp đồng', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public lockSeller = async (req: Request<ContractLockInput['params']>, res: Response): Promise<void> => {
    try {
      const { contractId } = req.params;
      const result = await this.service.lockSellerAccount(contractId);
      res.status(200).json({ success: true, message: 'Tài khoản người bán đã bị khóa thành công', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi khóa tài khoản người bán', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public handleNonRenewal = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.handleNonRenewal();
      res.status(200).json({ success: true, message: 'Xử lý không gia hạn hợp đồng đã hoàn thành', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi xử lý không gia hạn hợp đồng', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public sendScheduledNotifications = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.sendScheduledNotifications();
      res.status(200).json({ success: true, message: 'Thông báo gia hạn hợp đồng đã được gửi thành công', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi gửi thông báo gia hạn hợp đồng', error: error instanceof Error ? error.message : String(error) });
    }
  };
}