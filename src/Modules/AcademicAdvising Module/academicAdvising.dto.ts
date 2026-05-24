import { z } from "zod";

import { courseSchema } from "./academicAdvising.validation";

export type ICourseDto =
  z.infer<typeof courseSchema.params>;