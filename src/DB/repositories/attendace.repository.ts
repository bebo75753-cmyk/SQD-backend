 import {
  ProjectionType,
  QueryOptions,
//   UpdateQuery,
//   MongooseUpdateQueryOptions,
//   Types,
} from "mongoose";

import {
  AttendanceModel,
  IAttendance,
  AttendanceDocument,
  AttendanceStatusEnum,
} from "../Models/attendance.model";

import { DatabaseRepository } from "../../DB/repositories/database.repository";
// import { AttendanceStatusEnum } from "../Models/attendance.model";

export class AttendanceRepository extends DatabaseRepository<IAttendance> {
  constructor() {
    super(AttendanceModel as any);
  }

  //  إنشاء تسجيل حضور
  async createAttendance(
    data: Partial<IAttendance>[],
    options?: QueryOptions<IAttendance> | any
  ): Promise<AttendanceDocument[] | undefined> {
    const result = await this.create({ data, options });
    return result as AttendanceDocument[] | undefined;
  }

  //  البحث عن حضور طالب في كورس في يوم معين
  async findByUserCourseDate(
    UserID: string,
    courseID: string,
    date: string,
    select: ProjectionType<IAttendance> | null = null,
    options: QueryOptions<IAttendance> | null = null
  ): Promise<AttendanceDocument | null> {
    const result = await this.findOne({
      filter: { UserID, courseID, date },
      select,
      options,
    });
    return result as AttendanceDocument | null;
  }

  //  هات   حضور طالب
  async findByUser(
    UserID: string,
    select: ProjectionType<IAttendance> | null = null,
    options: QueryOptions<IAttendance> | null = null
  ): Promise<AttendanceDocument[]> {
    const result = await this.find({
      filter: { UserID },
      select,
      options,
    });
    return result as AttendanceDocument[];
  }

  //  جلب حضور كورس في يوم معين (Dashboard دكتور)
  async findByCourseAndDate(
    courseID: string,
    date: string,
    select: ProjectionType<IAttendance> | null = null,
    options: QueryOptions<IAttendance> | null = null
  ): Promise<AttendanceDocument[]> {
    const result = await this.find({
      filter: { courseID, date },
      select,
      options,
    });
    return result as AttendanceDocument[];
  }

  //  التحقق هل الحضور مسجل بالفعل
  async isAttendanceRecorded(
    UserID: string,
    courseID: string,
    date: string
  ): Promise<boolean> {
    const attendance = await this.findOne({
      filter: { UserID, courseID, date },
    });
    return !!attendance;
  }


  //  حذف كل حضور كورس (لو اتحذف كورس)
  async deleteAllByCourse(courseID: string): Promise<any> {
    return await this.model.deleteMany({ courseID });
  }
  async getDistinctLectureDates(courseID: string): Promise<string[]> {
  return await this.model.distinct("date", { courseID });
}
//نسبة الحضور للطالب
async countStudentAttendance(
  UserID: string,
  courseID: string
): Promise<number> {
  return await this.model.countDocuments({
    UserID,
    courseID,
    status: AttendanceStatusEnum.PRESENT,
  });
}

}

export default new AttendanceRepository();
