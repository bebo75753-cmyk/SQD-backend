import { Schema, model, models, HydratedDocument } from "mongoose";

// نوع المادة

export enum MaterialTypeEnum {
  PDF = "PDF",
  PPT = "PPT",
  VIDEO = "VIDEO",
}


// شكل البيانات في DB

export interface IMaterial {
  title: string; // عنوان المادة
  courseID: string; // الكورس المرتبطة به (CSE101)
  uploader: string; // UserID للدكتور
  fileName: string; // اسم الملف المخزن
  fileUrl: string; // المسار /uploads/xxxx.pdf
  type: MaterialTypeEnum; // نوع المادة
  createdAt?: Date;
  updatedAt?: Date;
}

export type MaterialDocument = HydratedDocument<IMaterial>;


 //🔵 Schema

const materialSchema = new Schema<IMaterial>(
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
      // index: true,
    },

    uploader: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(MaterialTypeEnum),
      required: true,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  },
);


 // تحسين البحث

materialSchema.index({ courseID: 1 });
materialSchema.index({ uploader: 1 });

export const MaterialModel =
models.Material || model<IMaterial>("Material", materialSchema);
