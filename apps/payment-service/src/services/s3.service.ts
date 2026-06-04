// =============================================================================
// S3 Service - File uploads for payment-service (e.g. withdrawal proofs).
// Mirrors apps/identity-service/src/services/s3.service.ts but defaults
// to the "withdrawal-proofs" folder so artifacts are easy to audit.
// =============================================================================

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || "capstone-project-media-asset";

export class S3Service {
  async uploadFile(
    file: Express.Multer.File,
    folder = "withdrawal-proofs"
  ): Promise<string> {
    const ext = path.extname(file.originalname);
    const key = `${folder}/${randomUUID()}${ext}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return `https://${BUCKET}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.slice(1);
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: key,
        })
      );
    } catch {
      console.warn("Failed to delete S3 file:", fileUrl);
    }
  }
}

export const s3Service = new S3Service();
