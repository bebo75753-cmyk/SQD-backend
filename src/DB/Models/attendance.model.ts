import { Schema, model, models, HydratedDocument } from "mongoose";

//  حالة الحضور
export enum AttendanceStatusEnum {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

//  شكل الداتا المسجلة في DB
export interface IAttendance {
  UserID: string;        // STU20240102
  courseID: string;      // CSE101
  date: string;          // YYYY-MM-DD
  status: AttendanceStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AttendanceDocument = HydratedDocument<IAttendance>;

//  Schema
const attendanceSchema = new Schema<IAttendance>(
  {
    UserID: {
      type: String,
      required: true,
      trim: true,
    },
    courseID: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatusEnum),
      required: true,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

//  منع تكرار تسجيل حضور نفس الطالب لنفس الكورس في نفس اليوم
attendanceSchema.index(
  { UserID: 1, courseID: 1, date: 1 },
  { unique: true }
);

// تحسين البحث
attendanceSchema.index({ courseID: 1 });
attendanceSchema.index({ UserID: 1 });
attendanceSchema.index({ date: 1 });

export const AttendanceModel =
  models.Attendance || model<IAttendance>("Attendance", attendanceSchema);
