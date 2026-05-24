import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export enum RoleEnum {
  STUDENT = "STUDENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
}

export interface IUser {
  _id: Types.ObjectId;
  UserID: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: RoleEnum;
  major?: string;        // للطلاب فقط
  level?: number;        // للطلاب فقط
  department?: string;   // للدكاترة فقط
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;  
  confirmEmailOTP?: string; // رمز تأكيد الإيميل (يتخزن مشفر)
  confirmedAt?: Date;  
   username?: string; // 
     // وقت تأكيد الإيميل
}

export interface UserVirtuals {
  fullName: string;
  displayInfo: string;
}

export type UserDocument = HydratedDocument<IUser> & UserVirtuals;

const userSchema = new Schema<IUser>(
  {
    UserID: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true,
    },

    
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: String,
    address: String,
    confirmEmailOTP: {
  type: String,
  select: false, // مش ضروري يرجع في كل query
},
confirmedAt: {
  type: Date,
},

    role: {
      type: String,
      enum: Object.values(RoleEnum),
      required: true,
      default: RoleEnum.STUDENT,
    },
    major: {
      type: String,
      required: function (this: IUser) {
        return this.role === RoleEnum.STUDENT;
      },
      trim: true,
    },
    level: {
      type: Number,
      min: 1,
      max: 4,
      required: function (this: IUser) {
        return this.role === RoleEnum.STUDENT;
      },
    },
    department: {
      type: String,
      required: function (this: IUser) {
        return this.role === RoleEnum.DOCTOR;
      },
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  Virtuals
userSchema

.virtual("username")
.set(function(value:string){
    const [firstName,lastName ]=value.split(" ") ||[]
    this.set({firstName,lastName});
})
.get(function(){
    return `${this.firstName} ${this.lastName}`;
})
// userSchema.virtual("displayInfo").get(function (this: UserDocument) {
//   if (this.role === RoleEnum.STUDENT)
//     return `${this.username} - ${this.major} (Level ${this.level})`;
//   if (this.role === RoleEnum.DOCTOR)
//     return `Dr. ${this.fullName} - ${this.department}`;
//   return `${this.fullName} (${this.role})`;
// });

// //  Validation قبل الحفظ
// userSchema.pre("save", function (next) {
//   if (this.role === RoleEnum.STUDENT && (!this.major || !this.level)) {
//     return next(new Error("Student must have major and level"));
//   }
//   if (this.role === RoleEnum.DOCTOR && !this.department) {
//     return next(new Error("Doctor must have department"));
//   }
//   next();
// });

//  Indexes
// userSchema.index({ UserID: 1 }, { unique: true });
// userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ major: 1 });
userSchema.index({ department: 1 });
userSchema.index({ isActive: 1 });

export const UserModel = models.User || model<IUser>("User", userSchema);
export  type HUserDocument = HydratedDocument<IUser>;