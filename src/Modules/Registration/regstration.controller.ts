import { Router } from "express";
import RegistrationService from "./regstration.service";
import { authentacation } from "../../midellware/athuntacation.madrllware";
import { validation } from "../../midellware/validation.midellware";
import {
  createRegistrationSchema,
  cancelRegistrationSchema,
  approveOrRejectSchema,
  getStudentRegistrationsSchema,
  getCourseRegistrationsSchema,
} from "./regstration.validation";

const router = Router();

//  Create Registration (Student registers)
router.post(
  "/",
  authentacation(),
  validation(createRegistrationSchema),
  RegistrationService.createRegistration
);

//  Cancel Registration
router.delete(
  "/:UserID/:courseID/:semester",
  authentacation(),
  validation(cancelRegistrationSchema),
  RegistrationService.cancelRegistration
);

// Approve OR Reject Registration (Doctor)
router.patch(
  "/approve-reject",
  authentacation(),
  validation(approveOrRejectSchema),
  RegistrationService.approveOrReject
);

// Get Student Registrations
router.get(
  "/student/:UserID",
  authentacation(),
  validation(getStudentRegistrationsSchema),
  RegistrationService.getStudentRegistrations
);

//  Get Course Registrations
router.get(
  "/course/:courseID",
  authentacation(),
  validation(getCourseRegistrationsSchema),
  RegistrationService.getCourseRegistrations
);

export default router;
