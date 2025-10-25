import { databaseService } from "@/services/database.service";
export class WalletRepository {
  private prisma = databaseService.getClient();


 
  public async createWallet(userId:string): Promise<void> {
    await this.prisma.wallet.create({
      data:{userId} ,
    });
  }

}
