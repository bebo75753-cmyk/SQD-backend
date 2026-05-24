import z from "zod";
import {
  createCourseSchema,
  updateCourseSchema,
  getCourseByIDSchema,
  getByInstructorSchema,
  getByDepartmentSchema,
  searchCourseSchema
} from "./course.valdation";

export type ICreateCourseDto = z.infer<typeof createCourseSchema.body>;

export type IUpdateCourseDto = z.infer<typeof updateCourseSchema.body>;

export type IGetCourseByIdDto = z.infer<typeof getCourseByIDSchema.params>;

export type IDeleteCourseDto = z.infer<typeof getCourseByIDSchema.params>;

export type IGetByInstructorDto = z.infer<typeof getByInstructorSchema.params>;

export type IGetByDepartmentDto = z.infer<typeof getByDepartmentSchema.params>;

export type ISearchCourseDto = z.infer<typeof searchCourseSchema.params>;
