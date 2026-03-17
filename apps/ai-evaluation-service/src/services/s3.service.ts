// =============================================================================
// S3 Service - AWS S3 file storage for speaking audio
// =============================================================================

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || "capstone-project-media-asset";

export class S3Service {
  /**
   * Generate a presigned URL so frontend can upload directly to S3
   * Returns { uploadUrl, key, publicUrl }
   */
  async getPresignedUploadUrl(
    folder: string = "speaking",
    fileExtension: string = ".webm",
    mimeType: string = "audio/webm",
    expiresIn: number = 300 // 5 minutes
  ): Promise<{
    uploadUrl: string;
    key: string;
    publicUrl: string;
  }> {
    const key = `${folder}/${randomUUID()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
    const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`;

    return { uploadUrl, key, publicUrl };
  }

  /**
   * Upload a buffer directly from server (used for base64 fallback)
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string = "speaking",
    mimeType: string = "audio/webm",
    fileExtension: string = ".webm"
  ): Promise<string> {
    const key = `${folder}/${randomUUID()}${fileExtension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return `https://${BUCKET}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`;
  }

  /**
   * Download file from S3 as Buffer (for sending to Gemini)
   */
  async downloadAsBuffer(s3Url: string): Promise<Buffer> {
    const url = new URL(s3Url);
    const key = url.pathname.slice(1); // remove leading /

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    const stream = response.Body as NodeJS.ReadableStream;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  /**
   * Delete file from S3
   */
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
