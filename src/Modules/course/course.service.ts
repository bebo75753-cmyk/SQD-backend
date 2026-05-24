import { Request, Response } from "express";
import CourseRepository from "../../DB/repositories/course.repository";
import { BadRequestExption, NotFoundExption } from "../../Uitls/response/error.responsee";

export class CourseService {
  private _courseModel = CourseRepository;

  //  إنشاء كورس جديد
  createCourse = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body;

    const exists = await this._courseModel.isCourseIDExists(body.CourseID);
    if (exists) throw new BadRequestExption("CourseID already exists");

    const created = await this._courseModel.createCourse([body]);

    return res.status(201).json({
      message: "Course created successfully",
      data: created,
    });
  };

  //  كل الكورسات
  getAllCourses = async (req: Request, res: Response): Promise<Response> => {
    const courses = await this._courseModel.findAllCourses();

    return res.status(200).json({
      message: "Courses fetched successfully",
      data: courses,
    });
  };

  //  كورس معين
  getCourseByID = async (req: Request, res: Response): Promise<Response> => {
    const {CourseID} = req.params ;

    const course = await this._courseModel.findOne({filter:{CourseID:CourseID}});

    if (!course) throw new NotFoundExption("Course not found");

    return res.status(200).json({
      message: "Course fetched successfully",
      data: course,
    });
  };

  //  تعديل كورس
  updateCourse = async (req: Request, res: Response): Promise<Response> => {
    const CourseID = req.params.CourseID as string;
    const updateData = req.body;

    const updated = await this._courseModel.updateByCourseID(
      CourseID,
      updateData
    );

    if (!updated) throw new NotFoundExption("Course not found");

    return res.status(200).json({
      message: "Course updated successfully",
      data: updated,
    });
  };

  //  حذف كورس
  deleteCourse = async (req: Request, res: Response): Promise<Response> => {
    const CourseID = req.params.CourseID as string;

    const deleted = await this._courseModel.deleteCourse(CourseID);

    if (!deleted || deleted.deletedCount === 0)
      throw new NotFoundExption("Course not found or already deleted");

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  };

  //  كل كورسات دكتور معين
  getCoursesByInstructor = async (req: Request, res: Response): Promise<Response> => {
    const UserID = req.params.UserID as string;

    const result = await this._courseModel.findByInstructor(UserID);

    return res.status(200).json({
      message: "Courses fetched successfully",
      data: result,
    });
  };

  //  كل كورسات قسم معين
  getCoursesByDepartment = async (req: Request, res: Response): Promise<Response> => {
    const department = req.params.department as string;

    const result = await this._courseModel.findByDepartment(department);

    return res.status(200).json({
      message: "Courses fetched successfully",
      data: result,
    });
  };
}

export default new CourseService();

