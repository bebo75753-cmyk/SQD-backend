import { Schema, model, models, HydratedDocument } from "mongoose";

export interface IFinalExam {
  title: string;
  courseID: string;
  duration: number; // ⏱️ مدة الامتحان بالدقائق
  totalMarks: number;
  createdBy: string;

  questions: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    marks: number;
  }[];

  submissions: {
    UserID: string;
    answers: {
      questionIndex: number;
      selectedAnswer: string;
    }[];
    score: number;
    submittedAt: Date;
  }[];
}

export type FinalExamDocument = HydratedDocument<IFinalExam>;

const finalExamSchema = new Schema<IFinalExam>(
  {
    title: String,
    courseID: String,
    duration: Number,
    totalMarks: Number,
    createdBy: String,

    questions: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
        marks: Number,
      },
    ],

    submissions: [
      {
        UserID: String,
        answers: [
          {
            questionIndex: Number,
            selectedAnswer: String,
          },
        ],
        score: Number,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const FinalExamModel =
  models.FinalExam || model<IFinalExam>("FinalExam", finalExamSchema);