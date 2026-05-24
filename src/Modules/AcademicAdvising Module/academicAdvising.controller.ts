import { Router } from "express";

import AcademicAdvisingService from "./academicAdvising.service";

import { authentacation } from "../../midellware/athuntacation.madrllware";

import { validation } from "../../midellware/validation.midellware";

import { courseSchema } from "./academicAdvising.validation";

const router = Router();

// Student Analysis
router.get(
  "/me",
  authentacation(),
  AcademicAdvisingService.getMyAnalysis
);

// Weak Students
router.get(
  "/weak/:courseID",
  authentacation(),
  validation(courseSchema),
  AcademicAdvisingService.getWeakStudents
);

// Course Stats
router.get(
  "/stats/:courseID",
  authentacation(),
  validation(courseSchema),
  AcademicAdvisingService.getCourseStats
);

export default router;