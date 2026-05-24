import z from "zod";
import { genralFalds } from "../../midellware/validation.midellware";

/**
 * ➕ Create Course
 */
export const createCourseSchema = {
  body: z.strictObject({
    CourseID: z.string().regex(/^CSE\d+$/, {
      message: "Invalid CourseID format. Example: CRS101",
    }),
    name: z.string().min(3),
    credits: z.number().min(1),
    capacity: z.number().min(1),
    department: z.string().min(2),
    instructor: genralFalds.UserID, // UserID الخاص بالدكتور
  }),
};

/**
 * ✏ Update Course
 */
export const updateCourseSchema = {
  params: z.object({
    CourseID: z.string().regex(/^CSE\d+$/, {
      message: "Invalid CourseID format",
    }),
  }),
  body: z.strictObject({
    name: z.string().optional(),
    credits: z.number().optional(),
    capacity: z.number().optional(),
    department: z.string().optional(),
    instructor: genralFalds.UserID.optional(),
  }),
};

/**
 *  Get Course By ID
 */
export const getCourseByIDSchema = {
  params: z.object({
    CourseID: z.string().regex(/^CSE\d+$/, {
      message: "Invalid CourseID",
    }),
  }),
};

/**
 *  Delete Course
 */
export const deleteCourseSchema = {
  params: z.object({
    CourseID: z.string().regex(/^CSE\d+$/, {
      message: "Invalid CourseID",
    }),
  }),
};

/**
 *  Get Courses By Instructor ID
 */
export const getByInstructorSchema = {
  params: z.object({
    UserID: genralFalds.UserID, // نفس طريقة الدكتور في user.validation
  }),
};

/**
 *  Courses By Department
 */
export const getByDepartmentSchema = {
  params: z.object({
    department: z.string().min(2),
  }),
};

/**
 *  Search Course
 */
export const searchCourseSchema = {
  params: z.object({
    key: z.string().min(1),
  }),
};
