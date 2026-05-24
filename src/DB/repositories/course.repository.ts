import {
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  Types,
  UpdateQuery,
  MongooseUpdateQueryOptions,
} from "mongoose";
import { CourseModel, ICourse, CourseDocument } from "../Models/course.model ";
import { DatabaseRepository } from "./database.repository";

export class CourseRepository extends DatabaseRepository<ICourse> {
  constructor() {
    super(CourseModel);
  }

  
   // إنشاء كورس (يدعم Array لأن Base.create كذلك)
   
  async createCourse(
    data: Partial<ICourse>[],
    options?: any
  ): Promise<CourseDocument[] | undefined> {
    const result = await this.create({ data, options });
    return result as CourseDocument[] | undefined;
  }

 
  //  البحث بالكود CourseID
  
  async findByCourseID(
    CourseID: string,
    select?: ProjectionType<ICourse> | null,
    options?: QueryOptions<ICourse> | null
  ): Promise<CourseDocument | null> {
    const result = await this.findOne({
      filter: { CourseID },
      select,
      options,
    });

    return result as CourseDocument | null;
  }

  
   // البحث بالـ ObjectId
   
  async findById(
    id: string | Types.ObjectId,
    select?: ProjectionType<ICourse> | null,
    options?: QueryOptions<ICourse> | null
  ): Promise<CourseDocument | null> {
    const result = await this.findOne({
      filter: { _id: id },
      select,
      options,
    });

    return result as CourseDocument | null;
  }

  
   // جلب جميع الكورسات
   
  async findAllCourses(
    filter: RootFilterQuery<ICourse> = {},
    select?: ProjectionType<ICourse> | null,
    options?: QueryOptions<ICourse> | null
  ): Promise<CourseDocument[]> {
    const result = await this.find({
      filter,
      select,
      options,
    });

    return result as CourseDocument[];
  }

  
   // جلب كورسات دكتور معين
   
  async findByInstructor(
    instructor: string ,
    select?: ProjectionType<ICourse> | null,
    options?: QueryOptions<ICourse> | null
  ): Promise<CourseDocument[]> {
    const result = await this.find({
      filter: { instructor },
      select,
      options,
    });

    return result as CourseDocument[];
  }


   //  جلب كورسات قسم معين

  async findByDepartment(
    department: string,
    select?: ProjectionType<ICourse> | null,
    options?: QueryOptions<ICourse> | null
  ): Promise<CourseDocument[]> {
    const result = await this.find({
      filter: { department },
      select,
      options,
    });

    return result as CourseDocument[];
  }


    // تحديث باستخدام CourseID
  
  async updateByCourseID(
    CourseID: string,
    update: UpdateQuery<ICourse>,
    options?: MongooseUpdateQueryOptions<ICourse> | null
  ): Promise<CourseDocument | null> {
    const result = await this.updateOne({
      filter: { CourseID },
      update,
      options,
    });

    return result as unknown as CourseDocument | null;
  }

  // حذف كورس

  async deleteCourse(CourseID: string): Promise<any> {
    return await this.deleteOne({ CourseID });
  }

  
   // التحقق من وجود CourseID
   
  async isCourseIDExists(CourseID: string): Promise<boolean> {
    const result = await this.findOne({
      filter: { CourseID },
    });

    return !!result;
  }
}

export default new CourseRepository();
