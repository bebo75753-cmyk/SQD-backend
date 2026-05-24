import { Schema, model, models, HydratedDocument } from "mongoose";

export enum BehaviorTypeEnum {
  TAB_SWITCH = "TAB_SWITCH",
  MULTIPLE_FACES = "MULTIPLE_FACES",
  LOOKING_AWAY = "LOOKING_AWAY",
  SCREEN_EXIT = "SCREEN_EXIT",
}

export interface IExamBehavior {
  UserID: string;
  examID: string;
  type: BehaviorTypeEnum;
  timestamp?: Date;
}

export type ExamBehaviorDocument = HydratedDocument<IExamBehavior>;

const examBehaviorSchema = new Schema<IExamBehavior>(
  {
    UserID: {
      type: String,
      required: true,
    },
    examID: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(BehaviorTypeEnum),
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ExamBehaviorModel =
  models.ExamBehavior ||
  model<IExamBehavior>("ExamBehavior", examBehaviorSchema);