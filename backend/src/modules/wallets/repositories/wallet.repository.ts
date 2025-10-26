import { databaseService } from "@/services/database.service";
import type { PrismaTx } from "@/services/database.service";
import type { Wallet } from "@/../generated/prisma"
export class WalletRepository {
  private prisma = databaseService.getClient();

  public async createWallet(userId: string): Promise<void> {
    await this.prisma.wallet.create({
      data: { userId },
    });
  }
  public async incrementAllowance_InTx(
    userId: string,
    amount: number,
    tx: PrismaTx
  ): Promise<Wallet> {
    return tx.wallet.update({
      where: { userId: userId },
      data: {
        allowance: {
          increment: amount,
        },
      },
    });
  }
}
