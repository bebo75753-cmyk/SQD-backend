import { z } from "zod";

import {
createExtraCourseSchema,
deleteExtraCourseSchema,
} from "./extraCourse.validation";

export type ICreateExtraCourseDto =
z.infer<typeof createExtraCourseSchema.body>;

export type IDeleteExtraCourseDto =
z.infer<typeof deleteExtraCourseSchema.params>;