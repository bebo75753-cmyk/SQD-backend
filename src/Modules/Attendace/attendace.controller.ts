import { Router } from "express";
import AttendanceService from "./attendace.service";
import { aiAuthentication, authentacation } from "../../midellware/athuntacation.madrllware";
import { validation } from "../../midellware/validation.midellware";
import {
  createAttendanceSchema,
  getStuAttendPercentageSchema,
  // getStudentAttendanceSchema,
  getCourseAttendanceSchema,
} from "./attendace.validation";

const router = Router();

//  Record Attendance (AI / System)
router.post(
  "/",
  aiAuthentication(), // أو middleware خاص بالـ AI لو عندك
  validation(createAttendanceSchema),
  AttendanceService.recordAttendance
);

//  Get Student Attendance الطالب يشوف نفسه بس عن طريق ال token بتاعه 
router.get(
  "/student/me",
  authentacation(),
  // validation(getStudentAttendanceSchema),
  AttendanceService.getStudentAttendance
);

//
router.get(
  "/percent/course/:courseID/:UserID",
  authentacation(),
  validation(getStuAttendPercentageSchema),
  AttendanceService.getStuAttenPercDoctor
);


//  Get Course Attendance (Doctor Dashboard) بياخد منك التاريخ بعد idcourse  علشان يجيب اليوم ده
router.get(
  "/course/:courseID",
  authentacation(),
  validation(getCourseAttendanceSchema),

  AttendanceService.getCourseAttendance
);




export default router;
