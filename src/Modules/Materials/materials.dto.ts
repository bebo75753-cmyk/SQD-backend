import { z } from "zod";
import {
  createMaterialSchema,
  getMaterialsByCourseSchema,
  deleteMaterialSchema,
} from "./materials.validation";

export type ICreateMaterialDto = z.infer<
  typeof createMaterialSchema.body
>;

export type IGetMaterialsDto = z.infer<
  typeof getMaterialsByCourseSchema.params
>;

export type IDeleteMaterialDto = z.infer<
  typeof deleteMaterialSchema.params
>;
