import { Schema, model, models, HydratedDocument } from "mongoose";

// 🔵 حالة التسجيل
export enum RegistrationStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// 🔵 الفصل الدراسي (1-2-3)
export enum SemesterEnum {
  FALL = 1,     // التيرم الأول
  SPRING = 2,   // التيرم الثاني
  SUMMER = 3,   // الصيفي
}

// 🔵 شكل الداتا المسجلة في DB
export interface IRegistration {
  UserID: string;        // UserID زي STU20240102
  courseID: string;         // CourseID زي CSE101
  semester: SemesterEnum;   // رقم 1 أو 2 أو 3
  status: RegistrationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RegistrationDocument = HydratedDocument<IRegistration>;

// 🔵 Schema
const registrationSchema = new Schema<IRegistration>(
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
    semester: {
      type: Number,
      enum: [1, 2, 3],   // ⬅ مهم جدًا
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RegistrationStatusEnum),
      default: RegistrationStatusEnum.PENDING,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

//  منع تسجيل نفس الطالب لنفس الكورس في نفس التيرم
registrationSchema.index(
  { UserID: 1, courseID: 1, semester: 1 },
  { unique: true }
);

// تحسين البحث
registrationSchema.index({ courseID: 1 });
registrationSchema.index({ UserID: 1 });

export const RegistrationModel =
  models.Registration || model<IRegistration>("Registration", registrationSchema);




  
// import { Schema, model, models, HydratedDocument } from "mongoose";

// export enum RegistrationStatusEnum {
//   PENDING = "PENDING",
//   APPROVED = "APPROVED",
//   REJECTED = "REJECTED",
// }

// export enum SemesterEnum {
//   FALL = 1,     // الأول
//   SPRING = 2,   // الثاني
//   SUMMER = 3    // الصيفي
// }

// export interface IRegistration {
//   studentID: string;         // STUxxxx
//   courseID: string;          // CSE101
//   semester: SemesterEnum;    // 1 - 2 - 3
//   status: RegistrationStatusEnum;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export type RegistrationDocument = HydratedDocument<IRegistration>;

// const registrationSchema = new Schema<IRegistration>(
//   {
//     studentID: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     courseID: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     semester: {
//       type: Number,
//       enum: [1, 2, 3],   // ⬅التعديل هنا
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: Object.values(RegistrationStatusEnum),
//       default: RegistrationStatusEnum.PENDING,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// //  منع تسجيل الطالب لنفس المادة في نفس السمستر أكثر من مرة
// registrationSchema.index(
//   { studentID: 1, courseID: 1, semester: 1 },
//   { unique: true }
// );

// registrationSchema.index({ courseID: 1 });
// registrationSchema.index({ studentID: 1 });

// export const RegistrationModel =
//   models.Registration || model<IRegistration>("Registration", registrationSchema);
