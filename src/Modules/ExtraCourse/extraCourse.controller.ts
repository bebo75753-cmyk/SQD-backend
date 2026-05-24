import { Router } from "express";

import ExtraCourseService from "./extraCourse.service";

import { authentacation } from "../../midellware/athuntacation.madrllware";

import { validation } from "../../midellware/validation.midellware";

import {
createExtraCourseSchema,
deleteExtraCourseSchema,
} from "./extraCourse.validation";

const router = Router();

router.post(
"/",
authentacation(),
validation(createExtraCourseSchema),
ExtraCourseService.createCourse
);

router.get(
"/",
authentacation(),
ExtraCourseService.getCourses
);

router.delete(
"/:id",
authentacation(),
validation(deleteExtraCourseSchema),
ExtraCourseService.deleteCourse
);

export default router;