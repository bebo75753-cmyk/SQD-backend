import { Request, Response } from "express";
import { UserRepository } from "../../DB/repositories/user.repository";
import { UserModel, RoleEnum } from "../../DB/Models/user.model";
import { BadRequestExption, NotFoundExption } from "../../Uitls/response/error.responsee";
import { genrateHash } from "../../Uitls/security/hashing";

/**
 * 🧩 User Service
 * - تحويل كل الميثودز إلى Arrow Functions لتثبيت this context
 */
export class UserService {
  private _userModel = new UserRepository(UserModel);

  // 🧍‍♂️ عرض الملف الشخصي
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    const user = req.user;
    if (!user) throw new NotFoundExption("User not found");

    const userData = await this._userModel.findByUserID(user.UserID);
    if (!userData) throw new NotFoundExption("User profile not found");

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: userData
    });
  };

  // ✏️ تعديل الملف الشخصي (طالب)
  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    const user = req.user;
    if (!user) throw new NotFoundExption("User not found");

    const updateData = req.body;

    const updatedUser = await this._userModel.updateByUserID(user.UserID, updateData);
    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser
    });
  };

  // 📋عرض جميع الطلاب (Admin)
  getAllStudents = async (req: Request, res: Response): Promise<Response> => {
    const students = await this._userModel.find({
      filter: { role: RoleEnum.STUDENT },
    });
    return res.status(200).json({
      message: "All students fetched",
      data: students
    });
  };

  //  عرض جميع الدكاترة (Admin)
getAllDoctors = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const doctors =
    await this._userModel.findAllDoctors();

  return res.status(200).json({
    message: "All doctors fetched",
    data: doctors,
  });
};
  // ➕ إضافة طالب جديد (Admin)
  createStudent = async (req: Request, res: Response): Promise<Response> => {
    const { UserID, username, email, password, major, level, phone, address } = req.body;

    const existing = await this._userModel.findByEmail(email);
    if (existing) throw new BadRequestExption("Email already exists");

    const hashedPassword = await genrateHash(password);

    const newUser = await this._userModel.createUser({
      data: [
        {
          UserID,
          username,
          email,
          password: hashedPassword,
          role: RoleEnum.STUDENT,
          major,
          level,
          phone,
          address,
        },
      ],
      options: { validateBeforeSave: true },
    });

    return res.status(201).json({
      message: "Student created successfully",
      data: newUser
    });
  };

  // 🔄 تعديل بيانات طالب (Admin)
  updateStudent = async (req: Request, res: Response): Promise<Response> => {
    const { UserID } = req.params;
    const updateData = req.body;

    const updated = await this._userModel.updateOne({
      filter: { UserID: UserID },
      update: updateData,
    });

    if (!updated) throw new NotFoundExption("Student not found");

    return res.status(200).json({
      message: "Student updated successfully",
      data: updated
    });
  };

  // ❌ حذف طالب (Admin)
  deleteStudent = async (req: Request, res: Response): Promise<Response> => {
    const { UserID } = req.params;

    const deleted = await this._userModel.deleteOne({
      filter: { UserID: UserID },
    });
console.log("DELETE RESULT:", deleted);

    if (!deleted || deleted.deletedCount === 0)
      throw new NotFoundExption("Student not found or already deleted");

    return res.status(200).json({
      message: "Student deleted successfully"
    });
  };

  // delte Doc
  deleteDoctor = async (req: Request, res: Response): Promise<Response> => {
  const { UserID } = req.params;

  const deleted = await this._userModel.deleteOne({
    filter: { UserID:UserID  },
  });

  if (!deleted || deleted.deletedCount === 0) {
    throw new NotFoundExption("Doctor not found or already deleted");
  }

  return res.status(200).json({
    message: "Doctor deleted successfully"
  });
};

//

createDoctor = async (req: Request, res: Response): Promise<Response> => {
  const { UserID, username, email, password, department, phone, address } = req.body;

  // 🔍 تحقق من التكرار
  const existing = await this._userModel.findByEmail(email);
  if (existing) throw new BadRequestExption("Email already exists");

  // 🔐 تشفير الباسورد
  const hashedPassword = await genrateHash(password);

  // 🆕 إنشاء الدكتور
  const newDoctor = await this._userModel.createUser({
    data: [
      {
        UserID,
        username,
        email,
        password: hashedPassword,
        role: RoleEnum.DOCTOR,
        department,
        phone,
        address
      }
    ],
    options: { validateBeforeSave: true }
  });

  return res.status(201).json({
    message: "Doctor created successfully",
    data: newDoctor
  });
};


getDoctorById = async (req: Request, res: Response): Promise<Response> => {
  const { UserID } = req.params;

  const doctor = await this._userModel.findOne({
    filter: { UserID: UserID, role: RoleEnum.DOCTOR }
  });

  if (!doctor) {
    throw new NotFoundExption("Doctor not found");
  }

  return res.status(200).json({
    message: "Doctor fetched successfully",
    data: doctor
  });
};

//
updateDoctor = async (req: Request, res: Response): Promise<Response> => {
  const { UserID } = req.params;
  const updateData = req.body;

  const updated = await this._userModel.updateOne({
    filter: { UserID },
    update: updateData,
  });

  if (!updated) {
    throw new NotFoundExption("Doctor not found");
  }

  return res.status(200).json({
    message: "Doctor updated successfully",
    data: updated
  });
};


}

export default new UserService();




// import { Request, Response } from "express";
// import { UserRepository } from "../../DB/repositories/user.repository";
// import { UserModel, RoleEnum } from "../../DB/Models/user.model";
// import { BadRequestExption, NotFoundExption } from "../../Uitls/response/error.responsee";
// import { genrateHash } from "../../Uitls/security/hashing";

// /**
//  * 🧩 User Service
//  * نفس نمط auth.service
//  */
// export class UserService {
//   private _userModel = new UserRepository(UserModel);

//   // 🧍‍♂️ عرض الملف الشخصي
//   async getProfile(req: Request, res: Response): Promise<Response> {
//     const user = req.user;
//     if (!user) throw new NotFoundExption("User not found");

//     const userData = await this._userModel.findByUserID(user.UserID);
//     if (!userData) throw new NotFoundExption("User profile not found");

//     return res.status(200).json({ message: "Profile fetched successfully", data: userData });
//   }

//   // ✏️ تعديل الملف الشخصي (طالب)
//   async updateProfile(req: Request, res: Response): Promise<Response> {
//     const user = req.user;
//     if (!user) throw new NotFoundExption("User not found");

//     const updateData = req.body;

//     const updatedUser = await this._userModel.updateByUserID(user.UserID, updateData);
//     return res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
//   }

//   // 📋 عرض جميع الطلاب (Admin)
//   async getAllStudents(req: Request, res: Response): Promise<Response> {
//     const students = await this._userModel.find({ filter: { role: RoleEnum.STUDENT } });
//     return res.status(200).json({ message: "All students fetched", data: students });
//   }

//   // ➕ إضافة طالب جديد (Admin)
//   async createStudent(req: Request, res: Response): Promise<Response> {
//     const { UserID, username, email, password, major, level, phone, address } = req.body;

//     // تحقق من التكرار
//     const existing = await this._userModel.findByEmail(email);
//     if (existing) throw new BadRequestExption("Email already exists");

//     const hashedPassword = await genrateHash(password);

//     const newUser = await this._userModel.createUser({
//       data: [
//         {
//           UserID,
//           username,
//           email,
//           password: hashedPassword,
//           role: RoleEnum.STUDENT,
//           major,
//           level,
//           phone,
//           address,
//         },
//       ],
//       options: { validateBeforeSave: true },
//     });

//     return res.status(201).json({ message: "Student created successfully", data: newUser });
//   }

//   // 🔄 تعديل بيانات طالب (Admin)
//   async updateStudent(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updated = await this._userModel.updateOne({
//       filter: { _id: id },
//       update: updateData,
//     });

//     if (!updated) throw new NotFoundExption("Student not found");
//     return res.status(200).json({ message: "Student updated successfully", data: updated });
//   }

//   // ❌ حذف طالب (Admin)
//   async deleteStudent(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;

//     const deleted = await this._userModel.deleteOne({
//       filter: { _id: id },
//     });

//     if (!deleted || deleted.deletedCount === 0)
//       throw new NotFoundExption("Student not found or already deleted");

//     return res.status(200).json({ message: "Student deleted successfully" });
//   }
// }

// export default new UserService();
