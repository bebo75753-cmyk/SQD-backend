import z from "zod";
import { genralFalds } from "../../midellware/validation.midellware";

/**
 * 🧍‍♂️ عرض الملف الشخصي (GET /profile)
 */
export const getProfileSchema = {
  params: z.object({}).optional(),
  query: z.object({}).optional(),
};

/**
 *  تعديل الملف الشخصي (PUT /profile)
 */
export const updateProfileSchema = {
  body: z.strictObject({
    phone: genralFalds.phone.optional(),
    address: genralFalds.address.optional(),
    major: genralFalds.major.optional(),
    level: genralFalds.level.optional(),
  }),
};

/**
 * عرض جميع الطلاب (GET /admin/students)
 */
export const getAllStudentsSchema = {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }).optional(),
};
/**
 * عرض جميع الدكاترة (GET /admin/doctors)
 */
export const getAllDoctorsSchema = {
  query: z
    .object({
      page: z.string().optional(),
      limit: z.string().optional(),
    })
    .optional(),
};

/**
 *  إضافة طالب جديد (POST /admin/students)
 */
export const createStudentSchema = {
  body: z.strictObject({
    UserID: genralFalds.UserID,
    username: genralFalds.username,
    email: genralFalds.email,
    password: genralFalds.password,
    phone: genralFalds.phone.optional(),
    address: genralFalds.address.optional(),
    major: genralFalds.major,
    level: genralFalds.level,
  }),
};

/**
 *  تعديل بيانات طالب (PUT /admin/students/:id)
 */
export const updateStudentSchema = {
  params: z.object({
  UserID: z.string({ message: "Invalid student ID param" }).regex(/^STU\d+$/)
}),

  // params: z.strictObject({
  //   id: z.string({ message: "Invalid student ID param" }),
  // }),
  body: z.strictObject({
    phone: genralFalds.phone.optional(),
    address: genralFalds.address.optional(),
    major: genralFalds.major.optional(),
    level: genralFalds.level.optional(),
  }),
};

/**
 * حذف طالب (DELETE /admin/students/:id)
 */
export const deleteStudentSchema = {
  params: z.strictObject({
 UserID: z.string({ message: "Invalid student ID param" }).regex(/^STU\d+$/)
  }),
  
};
//admin create doc
export const createDoctorSchema = {
  body: z.object({
    UserID: z.string().regex(/^DOC\d+$/, {
      message: "Invalid Doctor ID format",
    }),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    department: z.string().min(2),
    phone: z.string().optional(),
    address: z.string().optional()
  })
};

//get doc bu id
export const getDoctorByIdSchema = {
  params: z.object({
    UserID: z.string().regex(/^DOC\d+$/, {
      message: "Invalid Doctor ID format",
    }),
  }),
};

// admin update Doc

export const updateDoctorSchema = {
  params: z.object({
    UserID: z.string().regex(/^DOC\d+$/, {
      message: "Invalid Doctor ID format",
    }),
  }),
  body: z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    department: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
};

// delete doc
export const deleteDoctorSchema ={
  params: z.object({
    UserID: z.string().regex(/^DOC\d+$/, {
      message: "Invalid Doctor ID format",
    }),
  }),
};
export const getAllAdminsSchema = {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }).optional(),
};