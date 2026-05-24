import { z } from "zod";

//  Regex مطابق للكورس
const CourseIDRegex = /^CSE\d+$/;
// const UserIDRegex = /^STU\d+$/;

//  Record Attendance (AI / System)
// export const createAttendanceSchema = {
//   body: z.object({
//     UserID: z.string().regex(/^STU\d+$/, { message: "Invalid studentID" }),
//     courseID: z.string().regex(CourseIDRegex, { message: "Invalid courseID" }),
//     date: z.string({message: "Date is required" }), // YYYY-MM-DD
//     status: z.enum(["PRESENT", "ABSENT"]),
//   }),
// };
export const createAttendanceSchema = {
  body: z.object({
    courseID: z.string().regex(CourseIDRegex),
    date: z.string(),
    attendances: z.array(
      z.object({
        UserID: z.string().regex(/^STU\d+$/),
        status: z.enum(["PRESENT", "ABSENT"]),
      })
    ),
  }),
};

//  Get Student Attendance
export const getStudentAttendanceSchema = {
  params: z.object({
    UserID: z.string().regex(/^STU\d+$/),
  }),
};

// Get Course Attendance (Doctor Dashboard)
export const getCourseAttendanceSchema = {
  params: z.object({
    courseID: z.string().regex(CourseIDRegex),
  }),
  query: z.object({
    date: z.string({ message: "Date is required" }),
  }),
};

export const getStuAttendPercentageSchema = {
  params: z.object({
    courseID: z.string().regex(/^CSE\d+$/),
    UserID: z.string().regex(/^STU\d+$/),
  }),
};



