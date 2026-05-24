import { Schema, model, models, HydratedDocument } from "mongoose";

export interface ISubmission {
  quizID: string;
  UserID: string;
  answers: {
    questionIndex: number;
    selectedAnswer: string;
  }[];
  score: number;
  submittedAt?: Date;
}

export type SubmissionDocument = HydratedDocument<ISubmission>;

const submissionSchema = new Schema<ISubmission>(
  {
    quizID: {
      type: String,
      required: true,
      trim: true,
    },
    UserID: {
      type: String,
      required: true,
      trim: true,
    },
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: "submittedAt" },
  }
);

// منع الطالب من إعادة التسليم لنفس الكويز
submissionSchema.index({ quizID: 1, UserID: 1 }, { unique: true });

export const SubmissionModel =
  models.Submission ||
  model<ISubmission>("Submission", submissionSchema);
  