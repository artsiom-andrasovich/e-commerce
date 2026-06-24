import { TGenerateUploadUrl, TGetSignedUrlsDto } from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { uploadService } from "./upload.service";

class UploadController {
  public async generateUploadUrl(
    req: Request<any, any, TGenerateUploadUrl>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const data = await uploadService.generateUploadUrl(dto);
      return res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async getAccessUrls(
    req: Request<any, any, TGetSignedUrlsDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { urls } = req.body;
      const signedUrls = await uploadService.getAccessUrls(urls);
      return res.status(200).json({ urls: signedUrls });
    } catch (e) {
      next(e);
    }
  }

  public async deleteFile(
    req: Request<{ key: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { key } = req.params;
      await uploadService.deleteFile(key);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const uploadController = new UploadController();
