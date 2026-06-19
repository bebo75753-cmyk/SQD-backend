import {
  RootFilterQuery,
  ProjectionType,
  QueryOptions,
  CreateOptions,
  UpdateQuery,
  MongooseUpdateQueryOptions,
  Types,Model,
  HydratedDocument
} from "mongoose";
import {  IUser, RoleEnum, UserDocument } from "../Models/user.model";
import { DatabaseRepository } from "./database.repository";
import {BadRequestExption} from "../../Uitls/response/error.responsee";

export class UserRepository extends DatabaseRepository<IUser> {
  constructor(protected override readonly model:Model<IUser>) {
    super(model );
  }

  //  إنشاء مستخدمين
  async createUser(
   { data,
    options,}:{
       data:Partial<IUser>[];
    options?: CreateOptions ;
    }
  ): Promise<HydratedDocument<IUser>[]> {
    const user = (await this.create({data, options,})) ||[];
     
if (!user)throw new BadRequestExption("filed to singup");
  

    return user;

  }

  //  البحث بكود المستخدم (UserID)
  async findByUserID(
    UserID: string,
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument | null> {
    const result = await this.findOne({
      filter: { UserID },
      select,
      options,
    });
    return result as UserDocument | null;
  }

  //  البحث بالـ ObjectId
  async findById(
    id: string | Types.ObjectId,
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument | null> {
    const result = await this.findOne({
      filter: { _id: id },
      select,
      options,
    });
    return result as UserDocument | null;
  }

  //  البحث بالبريد الإلكتروني
  async findByEmail(
    email: string,
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument | null> {
    const result = await this.findOne({
      filter: { email },
      select,
      options,
    });
    return result as UserDocument | null;
  }

  //  التحديث بناءً على UserID
  async updateByUserID(
    UserID: string,
    update: UpdateQuery<IUser>,
    options: MongooseUpdateQueryOptions<IUser> | null = null
  ): Promise<any> {
    return await this.updateOne({
      filter: { UserID },
      update,
      options,
    });
  }

  //  تأكيد البريد الإلكتروني
  async confirmEmail(UserID: string): Promise<any> {
    return await this.updateOne({
      filter: { UserID },
      update: {
        confirmedAt: new Date(),
        confirmEmailOTP: undefined,
      },
    });
  }

  //  التحقق من وجود إيميل
  async isEmailExists(
    email: string,
    excludeUserID?: string
  ): Promise<boolean> {
    const filter: RootFilterQuery<IUser> = { email };
    if (excludeUserID) {
      filter.UserID = { $ne: excludeUserID };
    }
    const user = await this.findOne({ filter });
    return !!user;
  }

  //  التحقق من وجود UserID
  async isUserIDExists(
    UserID: string,
    excludeUserID?: string
  ): Promise<boolean> {
    const filter: RootFilterQuery<IUser> = { UserID };
    if (excludeUserID) {
      filter.UserID = { $ne: excludeUserID };
    }
    const user = await this.findOne({ filter });
    return !!user;
  }

  //  البحث حسب التخصص (major)
  async findByMajor(
    major: string,
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument[]> {
    const result = await this.find({
      filter: { major },
      select,
      options,
    });
    return result as UserDocument[];
  }

  //  البحث حسب القسم (department)
  async findByDepartment(
    department: string,
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument[]> {
    const result = await this.find({
      filter: { department },
      select,
      options,
    });
    return result as UserDocument[];
  }

  //  جلب كل الطلاب
  async findAllStudents(
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument[]> {
    const result = await this.find({
      filter: { role: RoleEnum.STUDENT },
      select,
      options,
    });
    return result as UserDocument[];
  }
//delate student
override async deleteOne(
  {
    filter,
    options = {},
  }: {
    filter: RootFilterQuery<IUser>;
    options?: Record<string, any>;
  }
): Promise<any> {
  return await this.model.deleteOne(filter, options);
}


  // جلب كل الدكاترة
  async findAllDoctors(
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument[]> {
    const result = await this.find({
      filter: { role: RoleEnum.DOCTOR },
      select,
      options,
    });
    return result as UserDocument[];
  }
   async findAllAdmins(
    select: ProjectionType<IUser> | null = null,
    options: QueryOptions<IUser> | null = null
  ): Promise<UserDocument[]> {
    const result = await this.find({
      filter: { role: RoleEnum.ADMIN },
      select,
      options,
    });
    return result as UserDocument[];
  }
}




