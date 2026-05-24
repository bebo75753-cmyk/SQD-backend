import { z } from "zod";

//  Regex مطابق للكورس validation
 // CSE + أرقام فقط
 
const CourseIDRegex = /^CSE\d+$/;
// const UserID = /^STU\d+$/;


 //Create Registration
 
export const createRegistrationSchema = {
  body: z.object({
    UserID: z.string().regex( /^STU\d+$/, { message: "Invalid studentID" }),
    courseID: z.string().regex(CourseIDRegex, { message: "Invalid courseID" }),
    semester: z.number().int().min(1).max(3),
    //  status: z.enum(["PENDING"]),
  }),
};


  //Cancel Registration
 
export const cancelRegistrationSchema = {
  params: z.object({
    UserID: z.string().regex(/^STU\d+$/),
    courseID: z.string().regex(CourseIDRegex),
    semester: z.coerce.number().int().min(1).max(3),
  }),
};

 //Approve / Reject Registration

export const approveOrRejectSchema = {
  body: z.object({
    UserID: z.string().regex(/^STU\d+$/),
    courseID: z.string().regex(CourseIDRegex),
    semester: z.number().min(1).max(3),
    status: z.enum(["APPROVED", "REJECTED"]),
  }),
};


  //Get Student Registrations
 
export const getStudentRegistrationsSchema = {
  params: z.object({
    UserID: z.string().regex(/^STU\d+$/),
  }),
};


 //Get Course Registrations

export const getCourseRegistrationsSchema = {
  params: z.object({
    courseID: z.string().regex(CourseIDRegex),
  }),
  query: z.object({
    semester: z.string().optional(),
  }).optional(),
};
