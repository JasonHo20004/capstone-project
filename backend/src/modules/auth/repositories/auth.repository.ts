import { databaseService } from "@/services/database.service";
import type {  RefreshToken } from "@prisma/client";
import type{CreateRefreshTokenInput} from "../dtos/auth.dto"
export class AuthRepository {
  private prisma = databaseService.getClient();
  public async createNewRefreshToken(
    dataToken: CreateRefreshTokenInput
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: dataToken,
    });
  }

  public async findRefreshToken(hashedToken:string):Promise<RefreshToken|null>{
    return this.prisma.refreshToken.findUnique({
        where:{hashedToken}
    })
  }
  public async deleteRefreshToken(tokenId:string):Promise<void>{
    await this.prisma.refreshToken.delete({
        where:{id:tokenId}
    })
  }
}
