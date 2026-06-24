import { TGenerateUploadUrl } from "@app/lib-shared-types";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

import { env } from "../configs/env";

class UploadService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: env.AWS_ENDPOINT,
      region: env.AWS_S3_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  public async generateUploadUrl(dto: TGenerateUploadUrl) {
    const { filename, folder, contentType } = dto;
    const ext = filename.split(".").pop();
    const finalFileName = `${folder}/${crypto.randomUUID()}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: finalFileName,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    return { finalFileName, uploadUrl };
  }

  public async getAccessUrls(keys: string[]) {
    const promises = keys.map((key) => {
      const command = new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: key,
      });
      return getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
    });

    return Promise.all(promises);
  }

  public async deleteFile(path: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: path,
      }),
    );
    return;
  }
}

export const uploadService = new UploadService();
