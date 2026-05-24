import {
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  MongooseUpdateQueryOptions,
  // RootFilterQuery,
  Types,
} from "mongoose";
import {
  RegistrationModel,
  IRegistration,
  RegistrationDocument,

} from "../Models/registration.model ";
import { DatabaseRepository } from "../../DB/repositories/database.repository";

export class RegistrationRepository extends DatabaseRepository<IRegistration> {
  constructor() {
    super(RegistrationModel as any);
  }

  async createRegistration(
    data: Partial<IRegistration>[],
    options?: QueryOptions<IRegistration> | any
  ): Promise<RegistrationDocument[] | undefined> {
    const result = await this.create({ data, options });
    return result as RegistrationDocument[] | undefined;
  }

  async findByStudentAndCourse(
    UserID: string,
    courseID: string,
    semester: number,
    select: ProjectionType<IRegistration> | null = null,
    options: QueryOptions<IRegistration> | null = null
  ): Promise<RegistrationDocument | null> {
    const result = await this.findOne({
      filter: { UserID, courseID, semester },
      select,
      options,
    });
    return result as RegistrationDocument | null;
  }

  async findByStudent(
    UserID: string,
    select: ProjectionType<IRegistration> | null = null,
    options: QueryOptions<IRegistration> | null = null
  ): Promise<RegistrationDocument[]> {
    const result = await this.find({
      filter: { UserID },
      select,
      options,
    });
    return result as RegistrationDocument[];
  }

  async findByCourse(
    courseID: string,
    select: ProjectionType<IRegistration> | null = null,
    options: QueryOptions<IRegistration> | null = null
  ): Promise<RegistrationDocument[]> {
    const result = await this.find({
      filter: { courseID },
      select,
      options,
    });
    return result as RegistrationDocument[];
  }

  async findBySemester(
    semester: number,
    select: ProjectionType<IRegistration> | null = null,
    options: QueryOptions<IRegistration> | null = null
  ): Promise<RegistrationDocument[]> {
    const result = await this.find({
      filter: { semester },
      select,
      options,
    });
    return result as RegistrationDocument[];
  }

  async isStudentRegistered(
    UserID: string,
    courseID: string,
    semester: number
  ): Promise<boolean> {
    const registration = await this.findOne({
      filter: { UserID, courseID, semester },
    });
    return !!registration;
  }

  async updateRegistration(
    id: string | Types.ObjectId,
    update: UpdateQuery<IRegistration>,
    options: MongooseUpdateQueryOptions<IRegistration> | null = null
  ): Promise<RegistrationDocument | null> {
    const result = await this.model.findOneAndUpdate({ _id: id }, update, {
      ...options,
      new: true,
    });
    return result as RegistrationDocument | null;
  }

  // async deleteRegistration(
  //   UserID: string,
  //   courseID: string,
  //   semester: number
  // ): Promise<any> {
  //   return await this.deleteOne({
  //     filter: { UserID, courseID, semester },
  //   });
  // }
async deleteRegistration(
  UserID: string,
  courseID: string,
  semester: number
): Promise<any> {
  return await this.deleteOne({
    UserID,
    courseID,
    semester,
  });
}



  async deleteAllByCourse(courseID: string): Promise<any> {
    return await this.model.deleteMany({ courseID });
  }
}

export default new RegistrationRepository();

// import {
//   RegistrationModel,
//   IRegistration,
//   RegistrationDocument,
//   RegistrationStatusEnum,
// } from "../Models/registration.model ";
// import { DatabaseRepository } from "./database.repository";

// export class RegistrationRepository extends DatabaseRepository<IRegistration> {
//   constructor() {
//     super(RegistrationModel as any);
//   }

//   // إنشاء تسجيل جديد
//   async createRegistration(
//     data: Partial<IRegistration>[],
//     options?: any
//   ): Promise<RegistrationDocument[] | undefined> {
//     const result = await this.create({ data, options });
//     return result as RegistrationDocument[] | undefined;
//   }

//   //  البحث برقم الطالب + رقم المادة + السمستر
//   async findByUniqueKey(
//     studentID: string,
//     courseID: string,
//     semester: number
//   ): Promise<RegistrationDocument | null> {
//     const result = await this.findOne({
//       filter: { studentID, courseID, semester },
//     });
//     return result as RegistrationDocument | null;
//   }

//   //  كل تسجيلات طالب معين
//   async findByStudent(
//     studentID: string
//   ): Promise<RegistrationDocument[]> {
//     const result = await this.find({
//       filter: { studentID },
//     });
//     return result as RegistrationDocument[];
//   }

//   //  كل تسجيلات مادة معينة
//   async findByCourse(
//     courseID: string
//   ): Promise<RegistrationDocument[]> {
//     const result = await this.find({
//       filter: { courseID },
//     });
//     return result as RegistrationDocument[];
//   }

//   //  البحث حسب السمستر
//   async findBySemester(
//     semester: number
//   ): Promise<RegistrationDocument[]> {
//     const result = await this.find({
//       filter: { semester },
//     });
//     return result as RegistrationDocument[];
//   }

//   //  هل الطالب مسجل في كورس معين؟
//   async isStudentRegistered(
//     studentID: string,
//     courseID: string,
//     semester: number
//   ): Promise<boolean> {
//     const result = await this.findOne({
//       filter: { studentID, courseID, semester },
//     });
//     return !!result;
//   }

//   //  تحديث حالة التسجيل
//   async updateStatus(
//     studentID: string,
//     courseID: string,
//     semester: number,
//     status: RegistrationStatusEnum
//   ): Promise<RegistrationDocument | null> {
//     const result = await this.model.findOneAndUpdate(
//       { studentID, courseID, semester },
//       { status },
//       { new: true }
//     );
//     return result as RegistrationDocument | null;
//   }

//   //  حذف تسجيل
//   async deleteRegistration(
//     studentID: string,
//     courseID: string,
//     semester: number
//   ): Promise<any> {
//     return await this.deleteOne({
//       filter: { studentID, courseID, semester },
//     });
//   }

//   //  حذف كل تسجيلات طالب
//   async deleteAllByStudent(studentID: string): Promise<any> {
//     return await this.model.deleteMany({ studentID });
//   }

//   //  حذف كل تسجيلات كورس
//   async deleteAllByCourse(courseID: string): Promise<any> {
//     return await this.model.deleteMany({ courseID });
//   }
// }

// export default new RegistrationRepository();
