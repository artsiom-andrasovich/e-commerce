import { generateUploadUrlDto } from "@app/lib-shared-types";
import { Router } from "express";
import z from "zod";
import { validateRequest } from "zod-express-middleware";
import { uploadController } from "./upload.controller";

const router = Router();

router.post(
  "/",
  validateRequest({ body: generateUploadUrlDto }),
  uploadController.generateUploadUrl,
);
router.get(
  "/:key",
  validateRequest({ params: z.object({ key: z.string().min(1).max(50) }) }),
  uploadController.getAccessUrl,
);
router.delete(
  "/:key",
  validateRequest({ params: z.object({ key: z.string().min(1).max(50) }) }),
  uploadController.deleteFile,
);

export { router };
