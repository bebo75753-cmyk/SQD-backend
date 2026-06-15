
import { Schema, model, models, HydratedDocument, Types } from "mongoose";
import { IUser } from "./user.model";
import { string } from "zod";

export interface ICourse {
  _id: Types.ObjectId;
  CourseID: string;
  name: string;
  credits: number;
  capacity: number;
  department: string;
  instructor: string | IUser; // دكتور المادة
  createdAt: Date;
  instructorName:string;
  updatedAt?: Date;
}

export interface CourseVirtuals {
  displayInfo: string;
}

export type CourseDocument = HydratedDocument<ICourse> & CourseVirtuals;

const courseSchema = new Schema<ICourse, {}, CourseVirtuals>(
  {
    CourseID: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 2,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    

    department: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: string,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    
    instructorName:{
    type: String,
      required: true,
      trim: true,
      }
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual("displayInfo").get(function (this: CourseDocument) {
  return `${this.name} (${this.department}) - ${this.credits} credits`;
});

courseSchema.index({ CourseID: 1 }, { unique: true });
courseSchema.index({ department: 1 });
courseSchema.index({ name: 1 });

export const CourseModel = models.Course || model<ICourse>("Course", courseSchema);

