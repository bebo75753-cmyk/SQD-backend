import { Router } from "express";
import UserService from "./user.service";
import { validation } from "../../midellware/validation.midellware";
import {
  getProfileSchema,
  updateProfileSchema,
  getAllStudentsSchema,
  createStudentSchema,
  updateStudentSchema,
  deleteStudentSchema,
  deleteDoctorSchema,
  updateDoctorSchema,
  createDoctorSchema,getDoctorByIdSchema,getAllDoctorsSchema,
  getAllAdminsSchema
} from "./user.validation";
import { authentacation } from "../../midellware/athuntacation.madrllware";


const router = Router();

// الطالب
router.get("/profile", authentacation(), validation(getProfileSchema), UserService.getProfile);
router.put("/profile", authentacation(), validation(updateProfileSchema), UserService.updateProfile);

// الأدمن
router.get(
  "/admins",
  authentacation(),
  validation(getAllAdminsSchema),
  UserService.getAllAdmins
);
router.get("/admin/students", authentacation(), validation(getAllStudentsSchema), UserService.getAllStudents);
router.post("/admin/students", authentacation(), validation(createStudentSchema), UserService.createStudent);
router.put("/admin/students/:UserID", authentacation(), validation(updateStudentSchema), UserService.updateStudent);
router.delete("/admin/students/:UserID", authentacation(), validation(deleteStudentSchema), UserService.deleteStudent);

router.get("/admin/doctors", authentacation(), validation(getAllDoctorsSchema), UserService.getAllDoctors);
router.delete("/admin/doctors/:UserID", authentacation(), validation(deleteDoctorSchema), UserService.deleteDoctor);
router.put("/admin/doctors/:UserID",authentacation(),validation(updateDoctorSchema), UserService.updateDoctor);
router.post("/admin/doctors",authentacation(),validation(createDoctorSchema),UserService.createDoctor);
router.get(
  "/admin/doctors/:UserID",
  authentacation(),
  validation(getDoctorByIdSchema),
  UserService.getDoctorById
);


export default router;






