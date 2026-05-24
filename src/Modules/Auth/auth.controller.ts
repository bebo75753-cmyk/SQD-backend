import { Router } from "express";
import authService from "./auth.service";
import {validation} from "./../../midellware/validation.midellware";
import {confirmEmailSchema, loginSchema, singupSchema} from "./auth.validation";
const router:Router= Router();

router.post("/signup",validation(singupSchema),authService.signup);
router.post("/login",validation(loginSchema),authService.login);
router.patch("/confirm",validation(confirmEmailSchema),authService.confirmEmail);
export default router;  