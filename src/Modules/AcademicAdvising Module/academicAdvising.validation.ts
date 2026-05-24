import { z } from "zod";

export const courseSchema = {
  params: z.object({
    courseID: z.string(),
  }),
};