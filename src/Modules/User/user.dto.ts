import z from "zod";
import {
  getProfileSchema,
  updateProfileSchema,
  getAllStudentsSchema,
  createStudentSchema,
  updateStudentSchema,
  deleteStudentSchema,
} from "./user.validation";

/**
 * User DTOs
 * - استنتاج تلقائي من Zod Schemas
 */

export type IGetProfileDto = z.infer<typeof getProfileSchema.params>;

export type IUpdateProfileDto = z.infer<typeof updateProfileSchema.body>;

export type IGetAllStudentsDto = z.infer<typeof getAllStudentsSchema.query>;

export type ICreateStudentDto = z.infer<typeof createStudentSchema.body>;

export type IUpdateStudentDto = z.infer<typeof updateStudentSchema.body>;

export type IDeleteStudentDto = z.infer<typeof deleteStudentSchema.params>;
