import { Router } from "express";
import MaterialService from "./materials.service";
import { authentacation } from "../../midellware/athuntacation.madrllware";
import { validation } from "../../midellware/validation.midellware";
import {
  createMaterialSchema,
  getMaterialsByCourseSchema,
  deleteMaterialSchema,
} from "./materials.validation";
import { upload } from "./multer.config";

const router = Router();

router.post(
  "/",
  authentacation(),
  upload.single("file"),
  validation(createMaterialSchema),
  MaterialService.createMaterial
);

router.get(
  "/:courseID",
  authentacation(),
  validation(getMaterialsByCourseSchema),
  MaterialService.getMaterialsByCourse
);

router.delete(
  "/:id",
  authentacation(),
  validation(deleteMaterialSchema),
  MaterialService.deleteMaterial
);

export default router;
