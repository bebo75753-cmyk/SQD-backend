import { Schema, model, models, HydratedDocument } from "mongoose";

export interface IExamSession {
  UserID: string;
  examID: string;
  startTime: Date;
  endTime?: Date;
}

export type ExamSessionDocument = HydratedDocument<IExamSession>;

const examSessionSchema = new Schema<IExamSession>(
  {
    UserID: {
      type: String,
      required: true,
      trim: true,
    },
    examID: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const ExamSessionModel =
  models.ExamSession ||
  model<IExamSession>("ExamSession", examSessionSchema);