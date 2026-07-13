import {
  TGenerateUploadUrl,
  TGetBatchAccessUrlsDto,
} from "@app/lib-shared-types";
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

  public async getBatchAccessUrls(
    req: Request<any, any, TGetBatchAccessUrlsDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { keys } = req.body;
      const urls = await uploadService.getBatchAccessUrls(keys);
      return res.status(200).json(urls);
    } catch (e) {
      next(e);
    }
  }

  public async getAccessUrl(
    req: Request<{ key: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { key } = req.params;
      const url = await uploadService.getAccessUrl(key);
      return res.status(200).json({ url });
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
