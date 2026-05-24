import z from "zod";
import { genralFalds } from "../../midellware/validation.midellware";


/**
 *  Login Validation Schema
 */
export const loginSchema = {
  body: z.strictObject({
    email: genralFalds.email.optional(),
    UserID: genralFalds.UserID.optional(),   // استخدام userID (بالحروف الصغيرة)
    password: genralFalds.password,
  }).refine((data) => data.email || data.UserID , {
    message: "Either email or userID must be provided",
  }),
};
/**
 *  Confirm Email Schema
 */
export const confirmEmailSchema = {
  body: z.strictObject({
    email: genralFalds.email,
    otp: genralFalds.otp,
  }),
};

/**
 *  Signup Schema (Student / Doctor)
 * - بدون تحقق إيميل جامعي
 * - يعتمد فقط على UserID لتحديد الدور والتحقق من الحقول الخاصة
 */
export const singupSchema = {
  body: z
    .strictObject({
      UserID: z
        .string({ error: "UserID must be string" })
        .regex(/^(STU|DOC|ADM)\d+$/, {
          message: "Invalid UserID format (must start with STU, DOC, or ADM followed by numbers)",
        }),

      username: genralFalds.username,
      email: genralFalds.email,
      password: genralFalds.password,
      confirmpassword: genralFalds.confirmpassword,

      phone: z
        .string({ error: "Phone must be string" })
        .regex(/^(\+?\d{10,15})$/, { message: "Invalid phone number" })
        .optional(),

      address: z.string({ error: "Address must be string" }).optional(),
      major: z.string({ error: "Major must be string" }).optional(),
      level: z.number({ error: "Level must be number" }).optional(),
      department: z.string({ error: "Department must be string" }).optional(),
    })
    .superRefine((data, ctx) => {
      //  تحقق من تطابق الباسورد
      if (data.password !== data.confirmpassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmpassword"],
          message: "Password mismatch",
        });
      }

      // تحديد الدور من أول 3 حروف في UserID
      let role: "STUDENT" | "DOCTOR" | "ADMIN" | null = null;
      if (data.UserID.startsWith("STU")) role = "STUDENT";
      else if (data.UserID.startsWith("DOC")) role = "DOCTOR";
      else if (data.UserID.startsWith("ADM")) role = "ADMIN";

      //  منع تسجيل الأدمن
      if (role === "ADMIN") {
        ctx.addIssue({
          code: "custom",
          path: ["UserID"],
          message: "Admin registration not allowed",
        });
      }

      //  تحقق من الحقول المطلوبة لكل دور
      if (role === "STUDENT" && (!data.major || data.level === undefined)) {
        ctx.addIssue({
          code: "custom",
          path: ["major"],
          message: "Student must include major and level",
        });
      }

      if (role === "DOCTOR" && !data.department) {
        ctx.addIssue({
          code: "custom",
          path: ["department"],
          message: "Doctor must include department",
        });
      }
    }),
};


// import z from "zod";
// import { genralFalds } from "../../midellware/validation.midellware";

// /**
//  *  Login Validation Schema
//  */
// export const loginSchema = {
//   body: z.strictObject({
//     email: genralFalds.email,
//     password: genralFalds.password,
//   }),
// };

// /**
//  *  Confirm Email Schema
//  */
// export const confirmEmailSchema = {
//   body: z.strictObject({
//     email: genralFalds.email,
//     otp: genralFalds.otp,
//   }),
// };

// /**
//  *  Signup Schema (Student / Doctor)
//  * - بنفس ستايلك
//  * - مع تصحيح البريد الجامعي (domain check)
//  */
// export const singupSchema = {
//   body: z
//     .strictObject({
//       UserID: z
//         .string({ error: "UserID must be string" })
//         .regex(/^(STU|DOC)\d+$/, { message: "Invalid university ID format" }),
//         username:genralFalds.username,
//       // firstName: z
//       //   .string({ error: "firstName must be string" })
//       //   .min(2, { message: "First name too short" }),

//       // lastName: z
//       //   .string({ error: "lastName must be string" })
//       //   .min(2, { message: "Last name too short" }),

//       email: genralFalds.email,
//       password: genralFalds.password,
//       confirmpassword: genralFalds.confirmpassword,

//       phone: z
//         .string({ error: "Phone must be string" })
//         .regex(/^(\+?\d{10,15})$/, { message: "Invalid phone number" })
//         .optional(),
//         role: z.enum(["STUDENT", "DOCTOR", "ADMIN"]).optional(),
//       address: z.string({ error: "Address must be string" }).optional(),
//       major: z.string({ error: "Major must be string" }).optional(),
//       level: z.number({ error: "Level must be number" }).optional(),
//       department: z.string({ error: "Department must be string" }).optional(),
//     })
//     .superRefine((data, ctx) => {
//       //  تحقق من تطابق الباسورد
//       if (data.password !== data.confirmpassword) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["confirmpassword"],
//           message: "Password mismatch",
//         });
//       }

//       //  تحقق من UserID الصحيح
//       if (!/^(STU|DOC)\d+$/.test(data.UserID)) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["UserID"],
//           message: "UserID must start with STU or DOC followed by numbers",
//         });
//       }

//       //  تحقق من البريد الجامعي (مع حماية من undefined)
//       //  تحقق من البريد الجامعي بشكل آمن 100%
// let domain: string | null = null;

// if (typeof data.email === "string") {
//   const parts = data.email.split("@");
//   if (parts.length === 2 && parts[1]) {
//     domain = parts[1].toLowerCase();
//   }
// }

// if (!domain) {
//   ctx.addIssue({
//     code: "custom",
//     path: ["email"],
//     message: "Invalid or missing email format",
//   });
// } else {
//   if (data.UserID.startsWith("STU") && !domain.includes("student.univ.edu")) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["email"],
//       message: "Student must use university student email",
//     });
//   }

//   if (data.UserID.startsWith("DOC") && !domain.includes("faculty.univ.edu")) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["email"],
//       message: "Doctor must use faculty email",
//     });
//   }
// }

//       //  تحقق من الحقول الأكاديمية حسب الدور
//       //  تحقق من البريد الجامعي بشكل مرن
// if (data.UserID.startsWith("STU")) {
//   const allowedDomains = [
//     "student.univ.edu",
//     "university.edu",
//     "university.edu.eg",
//     "student.com",
//     "gmail.com",
//   ];
//   const valid = allowedDomains.some((d) => domain?.includes(d));
//   if (!valid) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["email"],
//       message:
//         "Student must use a valid student/university email (.edu, .edu.eg, student.com, gmail.com)",
//     });
//   }
// }

// if (data.UserID.startsWith("DOC")) {
//   const allowedDomains = ["faculty.univ.edu", "university.edu", "edu.eg"];
//   const valid = allowedDomains.some((d) => domain?.includes(d));
//   if (!valid) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["email"],
//       message:
//         "Doctor must use a valid faculty/university email (.edu, .edu.eg)",
//     });
//   }
// }
// })
// };
