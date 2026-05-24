import { z } from "zod";

const CourseIDRegex = /^CSE\d+$/;

export const createMaterialSchema = {
  body: z.object({
    title: z.string().min(3),
    courseID: z.string().regex(CourseIDRegex),
    type: z.enum(["PDF", "PPT", "VIDEO"]),
  }),
};

export const getMaterialsByCourseSchema = {
  params: z.object({
    courseID: z.string().regex(CourseIDRegex),
  }),
};

export const deleteMaterialSchema = {
  params: z.object({
    id: z.string(),
  }),
};
