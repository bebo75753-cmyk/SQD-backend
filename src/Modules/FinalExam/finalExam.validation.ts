import { z } from "zod";

export const createExamSchema = {
  body: z.object({
    title: z.string(),
    courseID: z.string(),
    duration: z.number(), // ⏱️ الدكتور يحدد الوقت
    totalMarks: z.number(),
    questions: z.array(
      z.object({
        questionText: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.string(),
        marks: z.number(),
      })
    ),
  }),
};

export const submitExamSchema = {
  body: z.object({
    examID: z.string(),
    answers: z.array(
      z.object({
        questionIndex: z.number(),
        selectedAnswer: z.string(),
      })
    ),
  }),
};