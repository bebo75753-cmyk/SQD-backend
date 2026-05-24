
import { Router } from "express";
import CourseService from "./course.service";
import { validation } from "../../midellware/validation.midellware";
import {
  createCourseSchema,
  updateCourseSchema,
  getCourseByIDSchema,
  deleteCourseSchema,
  getByInstructorSchema,
  getByDepartmentSchema
} from "./course.valdation";
import { authentacation } from "../../midellware/athuntacation.madrllware";

const router: Router = Router();

// إنشاء كورس جديد
router.post(
  "/",
  authentacation(),
  validation(createCourseSchema),
  CourseService.createCourse
);

//  كل الكورسات
router.get(
  "/",
  authentacation(),
  CourseService.getAllCourses
);

//  كورس واحد
router.get(
  "/:CourseID",
  authentacation(),
  validation(getCourseByIDSchema),
  CourseService.getCourseByID
);

//  تعديل كورس
router.put(
  "/:CourseID",
  authentacation(),
  validation(updateCourseSchema),
  CourseService.updateCourse
);

//  حذف كورس
router.delete(
  "/:CourseID",
  authentacation(),
  validation(deleteCourseSchema),
  CourseService.deleteCourse
);

//  كورسات الدكتور
router.get(
  "/instructor/:UserID",
  authentacation(),
  validation(getByInstructorSchema),
  CourseService.getCoursesByInstructor
);

//  كورسات القسم
router.get(
  "/department/:department",
  authentacation(),
  validation(getByDepartmentSchema),
  CourseService.getCoursesByDepartment
);



export default router;
