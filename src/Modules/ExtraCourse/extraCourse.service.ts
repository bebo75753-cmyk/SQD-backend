import { Request, Response } from "express";
import ExtraCourseRepository from "../../DB/repositories/extraCourse.repoistory";
import {
    BadRequestExption,
ForbiddenExption,
NotFoundExption,
} from "../../Uitls/response/error.responsee";

export class ExtraCourseService {

private _extraModel = ExtraCourseRepository;

createCourse = async (
req: Request,
res: Response
): Promise<Response> => {

if (req.user?.role !== "DOCTOR") {
throw new ForbiddenExption("Only doctor can create course");
}

const created =
await this._extraModel.createCourse([req.body]);

return res.status(201).json({
message: "Extra course created successfully",
data: created,
});
};

getCourses = async (
req: Request,
res: Response
): Promise<Response> => {

const courses =
await this._extraModel.findCourses();

return res.status(200).json({
message: "Extra courses fetched successfully",
data: courses,
});
};

deleteCourse = async (
req: Request,
res: Response
): Promise<Response> => {

if (req.user?.role !== "DOCTOR") {
throw new ForbiddenExption("Only doctor can delete course");
}

const { id } = req.params;
if(!id){
    throw new BadRequestExption("not found id of extra course")
};
const deleted =
await this._extraModel.deleteCourse(id);

if (!deleted || deleted.deletedCount === 0) {
throw new NotFoundExption("Course not found");
}

return res.status(200).json({
message: "Course deleted successfully",
});
};

}

export default new ExtraCourseService();