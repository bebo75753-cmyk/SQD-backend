import { z } from "zod";
import {
  createRegistrationSchema,
  cancelRegistrationSchema,
  approveOrRejectSchema,
  getStudentRegistrationsSchema,
  getCourseRegistrationsSchema,
} from "./regstration.validation";

export type ICreateRegistrationDto = z.infer<typeof createRegistrationSchema.body>;

export type ICancelRegistrationDto = z.infer<typeof cancelRegistrationSchema.params>;

export type IApproveRejectRegistrationDto = z.infer<typeof approveOrRejectSchema.body>;

export type IGetStudentRegistrationsDto = z.infer<
  typeof getStudentRegistrationsSchema.params
>;

export type IGetCourseRegistrationsDto = z.infer<
  typeof getCourseRegistrationsSchema.params
>;
