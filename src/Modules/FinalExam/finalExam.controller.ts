import { Router } from "express";
import FinalExamService from "./finalExam.service";
import { authentacation } from "../../midellware/athuntacation.madrllware";

const router = Router();

// create
router.post("/", authentacation(), FinalExamService.createExam);

// get exam
router.get("/:examID", authentacation(), FinalExamService.getExam);

// submit
router.post("/submit", authentacation(), FinalExamService.submitExam);

// doctor results
router.get(
  "/results/:examID",
  authentacation(),
  FinalExamService.getResults
);

// student result
router.get(
  "/results/:examID/me",
  authentacation(),
  FinalExamService.getMyResult
);

export default router;