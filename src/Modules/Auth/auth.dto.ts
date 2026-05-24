import z from "zod";
import { singupSchema, loginSchema, confirmEmailSchema } from "./auth.validation";

/*
نوع بيانات التسجيل (Signup)
بيستنتج النوع تلقائي من Zod Schema
 */
export type ISignupDot = z.infer<typeof singupSchema.body>;

/*
نوع بيانات تسجيل الدخول (Login)
 */
export type ILoginDot = z.infer<typeof loginSchema.body>;

/*
نوع بيانات تأكيد الإيميل (Confirm Email)
 */
export type IConfirmEmailDot = z.infer<typeof confirmEmailSchema.body>;
