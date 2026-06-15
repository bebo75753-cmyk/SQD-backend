import { Schema, model, models, HydratedDocument } from "mongoose";

export enum BehaviorTypeEnum {
  USING_PHONE = "USING_PHONE",
  TALKING_TO_OTHERS = "TALKING_TO_OTHERS",
  LOOKING_AWAY = "LOOKING_AWAY",
  
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