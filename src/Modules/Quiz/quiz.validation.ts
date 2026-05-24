import { z } from "zod";

const CourseIDRegex = /^CSE\d+$/;

export const createQuizSchema = {
  body: z.object({
    title: z.string().min(3),
    courseID: z.string().regex(CourseIDRegex),
    duration: z.number().min(1),
    totalMarks: z.number().min(1),
    questions: z.array(
      z.object({
        questionText: z.string().min(5),
        type: z.enum(["MCQ", "TRUE_FALSE"]),
        options: z.array(z.string()),
        correctAnswer: z.string(),
        marks: z.number().min(1),
      })
    ).min(1),
  }),
};

export const getQuizByIdSchema = {
  params: z.object({
    id: z.string(),
  }),
};
export const getMyResultsSchema = {
  params: z.object({}).optional(),
};

export const getQuizResultsSchema = {
  params: z.object({
    quizID: z.string(),
  }),
};
export const deleteQuizSchema = getQuizByIdSchema;