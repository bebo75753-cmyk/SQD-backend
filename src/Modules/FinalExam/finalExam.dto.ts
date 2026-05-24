import { z } from "zod";
import {
  createExamSchema,
  submitExamSchema,
} from "./finalExam.validation";

export type ICreateExamDto =
  z.infer<typeof createExamSchema.body>;

export type ISubmitExamDto =
  z.infer<typeof submitExamSchema.body>;