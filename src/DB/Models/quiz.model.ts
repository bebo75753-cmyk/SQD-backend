import { Schema, model, models, HydratedDocument } from "mongoose";

//  نوع السؤال
export enum QuestionTypeEnum {
  MCQ = "MCQ",
  TRUE_FALSE = "TRUE_FALSE",
}

//  شكل السؤال
export interface IQuestion {
  questionText: string;
  type: QuestionTypeEnum;
  options: string[]; // في حالة MCQ أو TRUE_FALSE
  correctAnswer: string;
  marks: number;
}

//  شكل الكويز
export interface IQuiz {
  title: string;
  courseID: string;
  duration: number; // بالدقائق
  totalMarks: number;
  questions: IQuestion[];
  createdBy: string; // Doctor UserID
  createdAt?: Date;
  updatedAt?: Date;
}

export type QuizDocument = HydratedDocument<IQuiz>;

//  Question SubSchema
const questionSchema = new Schema<IQuestion>(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(QuestionTypeEnum),
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

//  Quiz Schema
const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseID: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// تحسين البحث
quizSchema.index({ courseID: 1 });
quizSchema.index({ createdBy: 1 });

export const QuizModel =
  models.Quiz || model<IQuiz>("Quiz", quizSchema);