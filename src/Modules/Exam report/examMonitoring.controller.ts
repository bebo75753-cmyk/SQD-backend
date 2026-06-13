import { Router } from "express";

import ExamMonitoringService from "./examMonitoring.service";

import { aiAuthentication, authentacation } from "../../midellware/athuntacation.madrllware";

import { validation } from "../../midellware/validation.midellware";

import {
  startExamSchema,
  // recordBehaviorSchema,
  createExamBehaviorSchema,
  endExamSchema,
  getReportSchema,
} from "./examMonitoring.validation";

const router = Router();

// =====================
// Start Exam
// =====================
router.post(
  "/start",
  authentacation(),
  validation(startExamSchema),
  ExamMonitoringService.startExam
);
router.post(
  "/ai/exam-behavior",
  aiAuthentication(),
  validation(createExamBehaviorSchema),
  ExamMonitoringService.recordAiBehavior
);
// =====================
// Record Behavior
// =====================
// router.post(
//   "/behavior",
//   aiAuthentication(),
//   validation(recordBehaviorSchema),
 
// );

// =====================
// End Exam
// =====================
router.post(
  "/end",
  authentacation(),
  validation(endExamSchema),
  ExamMonitoringService.endExam
);

// =====================
// Doctor Report
// =====================
router.get(
  "/report/:examID",
  authentacation(),
  validation(getReportSchema),
  ExamMonitoringService.getExamReport
);

export default router;