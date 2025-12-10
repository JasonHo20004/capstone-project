//import { databaseService } from "@/services/database.service";
import type { PrismaTx } from "@/services/database.service";
import type { Transaction } from "@prisma/client"

export class TransactionRepository {
 
  public async createDeposit_InTx(data: {
    walletId: string;
    topupOrderId: string;
    amount: number;
    description: string;
  }, tx: PrismaTx): Promise<Transaction> {
    return tx.transaction.create({
      data: {
        amount: data.amount,
        walletId: data.walletId,
        topupOrderId: data.topupOrderId,
        description: data.description,
        status: 'SUCCESS',
        transactionType: 'DEPOSIT',
      },
    });
  }
  public async createPayment_InTx(data: {
    walletId: string;
    amount: number;
    orderId: string,
  }, tx: PrismaTx): Promise<Transaction> {
    return tx.transaction.create({
      data: {
        amount: data.amount,
        walletId: data.walletId,
        orderId:data.orderId,
        status: 'SUCCESS',
        transactionType: 'PAYMENT',
      },
    });
  }
}