import { databaseService } from "@/services/database.service";
import type { Wallet} from "@/../generated/prisma";
// import type {
//   SafeUser,
//   CreateUserInput,
//   CreateCourseSellerApplicationInput,
// } from "@/modules/users/dtos/user.dto";
export class WalletRepository {
  private prisma = databaseService.getClient();


 
  public async createWallet(userId:string): Promise<void> {
    await this.prisma.wallet.create({
      data:{userId} ,
    });
  }

}
