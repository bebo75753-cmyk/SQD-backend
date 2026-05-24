import { z } from "zod";
import {
  createQuizSchema,
  getQuizByIdSchema,
  getQuizResultsSchema,
} from "./quiz.validation";

export type ICreateQuizDto =
  z.infer<typeof createQuizSchema.body>;

export type IGetQuizByIdDto =
  z.infer<typeof getQuizByIdSchema.params>;
  export type IGetQuizResultsDto =
  z.infer<typeof getQuizResultsSchema.params>;