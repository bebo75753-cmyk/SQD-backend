import { Router } from "express";
import QuizService from "./quiz.service";
import { authentacation } from "../../midellware/athuntacation.madrllware";
import { validation } from "../../midellware/validation.midellware";
import {
  createQuizSchema,
  getQuizByIdSchema,
  deleteQuizSchema,
  getQuizResultsSchema,
} from "./quiz.validation";

const router = Router();

router.post(
  "/",
  authentacation(),
  validation(createQuizSchema),
  QuizService.createQuiz
);

router.get(
  "/:id",
  authentacation(),
  validation(getQuizByIdSchema),
  QuizService.getQuizById
);

router.delete(
  "/:id",
  authentacation(),
  validation(deleteQuizSchema),
  QuizService.deleteQuiz
);
router.post(
  "/submit",
  authentacation(),
  QuizService.submitQuiz
);
router.get(
  "/results/me",
  authentacation(),
  QuizService.getMyResults
);

router.get(
  "/results/:quizID",
  authentacation(),
  validation(getQuizResultsSchema),
  QuizService.getQuizResults
);

export default router;