import { z } from "zod";
import {
  createAttendanceSchema,
  getStudentAttendanceSchema,
  getCourseAttendanceSchema,
  getStuAttendPercentageSchema,
} from "./attendace.validation";

// Record Attendance
export type ICreateAttendanceDto = z.infer<
  typeof createAttendanceSchema.body
>;

// Get Student Attendance
export type IGetStudentAttendanceDto = z.infer<
  typeof getStudentAttendanceSchema.params
>;

// Get Course Attendance
export type IGetCourseAttendanceDto = z.infer<
  typeof getCourseAttendanceSchema.params
>;
export type IGetStuAttenPercDoctorDto = z.infer<
  typeof getStuAttendPercentageSchema.params
>;
