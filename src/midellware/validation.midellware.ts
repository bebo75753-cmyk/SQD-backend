
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestExption } from "./../Uitls/response/error.responsee";
import z from "zod";
type ReqTypeKey= keyof Request;
type SchemaType= Partial<Record<ReqTypeKey,ZodType>>;
export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    const validationErrors: Array<{
        key: ReqTypeKey;
        issuse: Array<{ message:string ; path:(string |number |symbol) [] }>

    }> = [];

    for (const key of Object.keys(schema) as ReqTypeKey[]) {
      if (!schema[key]) continue;

      const validationResults = schema[key].safeParse(req[key]);
      if (!validationResults.success) {
        const errors = validationResults.error as ZodError;
        validationErrors.push({
          key,
       issuse:errors.issues.map((issue)=>{
        return {message:issue.message,path:issue.path};

       })
        });
      }
    }

    if (validationErrors.length > 0) {
      throw new BadRequestExption("Validation Error", {
        cause: validationErrors,
      });
    }

    return next()as unknown as NextFunction;
  };
};

export const genralFalds = {
  UserID: z
    .string({ message: "UserID must be string" })
    .min(3, { message: "UserID is required" })
    .regex(/^(STU|ADM|DOC)\d+$/, { message: "Invalid university ID format" }),


  // firstName: z.string({ message: "First name must be string" }).min(2, { message: "First name is required" }),

  // lastName: z.string({ message: "Last name must be string" }).min(2, { message: "Last name is required" }),

username:z.string
        ({error:"Username must be string",})

.min(3,{error:"min length must be 3"}) 
.max(20,{error:"max length mast be  20"}),

  email: z.email({ message: "Invalid email format" }),

  password: z.string({ message: "Password must be string" }).min(6, { message: "Password must be at least 6 characters" }),

  confirmpassword: z.string({ message: "Confirm password must be string" }).min(6, { message: "Confirm password is required" }),

  otp: z.string({ message: "OTP must be string" }).regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),

  phone: z
    .string({ message: "Phone must be string" })
    .regex(/^(\+?\d{10,15})$/, { message: "Invalid phone number" }),

  address: z.string({ message: "Address must be string" }).min(3, { message: "Address too short" }),

  major: z.string({ message: "Major must be string" }).min(2, { message: "Major is required" }),

  level: z.number({ message: "Level must be number" }).int().min(1, { message: "Level must be between 1 and 4" }).max(4, { message: "Level must be between 1 and 4" }),

  department: z.string({ message: "Department must be string" }).min(2, { message: "Department is required" }),
};
