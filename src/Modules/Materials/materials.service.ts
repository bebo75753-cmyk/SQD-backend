import { Request, Response } from "express";
import MaterialRepository from "../../DB/repositories/materials.repository";
import RegistrationRepository from "../../DB/repositories/registration.repository";
import {
  BadRequestExption,
  ForbiddenExption,
  NotFoundExption,
} from "../../Uitls/response/error.responsee";

export class MaterialService {
  private _materialModel = MaterialRepository;
  private _registrationModel = RegistrationRepository;

  //  Upload Material (Doctor Only)
  createMaterial = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Access denied");
    }

    const { title, courseID, type } = req.body;

    if (!title || !courseID || !type) {
      throw new BadRequestExption("Missing required fields");
    }

    if (!req.file) {
      throw new BadRequestExption("File is required");
    }

    const created = await this._materialModel.createMaterial([
      {
        title,
        courseID,
        type,
        fileName: req.file.filename,
        fileUrl: `/uploads/${req.file.filename}`,
        uploader: req.user.UserID,
      },
    ]);

    return res.status(201).json({
      message: "Material uploaded successfully",
      data: created,
    });
  };

  //  Get Materials (Student must be registered)
  getMaterialsByCourse = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { courseID } = req.params;

    if (!courseID) {
      throw new BadRequestExption("courseID is required");
    }

    // لو طالب لازم يكون مسجل
    if (req.user?.role === "STUDENT") {
      const registrations =
        await this._registrationModel.findByStudent(
          req.user.UserID
        );

      const registeredCourse = registrations.find(
        (r) => r.courseID === courseID
      );

      if (!registeredCourse) {
        throw new ForbiddenExption(
          "You are not registered in this course"
        );
      }
    }

    const materials =
      await this._materialModel.findByCourse(courseID);

    if (!materials || materials.length === 0) {
      throw new NotFoundExption("No materials found");
    }

    return res.status(200).json({
      message: "Materials fetched successfully",
      data: materials,
    });
  };

  // Delete Material (Doctor Only)
  deleteMaterial = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Access denied");
    }

    const { id } = req.params;

    if (!id) {
      throw new BadRequestExption("Material ID is required");
    }

    const deleted = await this._materialModel.deleteMaterial(id);

    if (!deleted) {
      throw new NotFoundExption("Material not found");
    }

    return res.status(200).json({
      message: "Material deleted successfully",
      data: deleted,
    });
  };
}

export default new MaterialService();



// import { Request, Response } from "express";
// import MaterialRepository from "../../DB/repositories/materials.repository";
// import RegistrationRepository from "../../DB/repositories/registration.repository";
// import { BadRequestExption } from "../../Uitls/response/error.responsee";

// export class MaterialService {
//   private _materialModel = MaterialRepository;
//   private _registrationModel = RegistrationRepository;

  
// // Upload Material (Doctor Only)
 
//   createMaterial = async (
//     req: Request,
//     res: Response
//   ): Promise<Response> => {
//     if (req.user?.role !== "DOCTOR") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const { title, courseID, type } = req.body;

//     if (!req.file) {
//       throw new BadRequestExption("File is required");
//     }

//     const created = await this._materialModel.createMaterial([
//       {
//         title,
//         courseID,
//         type,
//         fileName: req.file.filename,
//         fileUrl: `/uploads/${req.file.filename}`,
//         uploader: req.user?.UserID,
//       },
//     ]);

//     return res.status(201).json({
//       message: "Material uploaded successfully",
//       data: created,
//     });
//   };

//   
//    // Get Materials (Student must be registered)
//    
//   getMaterialsByCourse = async (
//     req: Request,
//     res: Response
//   ): Promise<Response> => {
//     const { courseID } = req.params;

//     // لو طالب لازم يكون مسجل
//     if (req.user?.role === "STUDENT") {
//       const isRegistered =
//         await this._registrationModel.findByStudent(
//           req.user.UserID
//         );

//       const registeredCourse = isRegistered.find(
//         (r) => r.courseID === courseID
//       );

//       if (!registeredCourse) {
//         return res.status(403).json({
//           message: "You are not registered in this course",
//         });
//       }
//     }

//     const materials =
//       await this._materialModel.findByCourse(courseID);
// if(!courseID){
//     throw new BadRequestExption(" c")
// }
//     return res.status(200).json({
//       message: "Materials fetched successfully",
//       data: materials,
//     });
//   };

//   
//    // Delete Material (Doctor Only)
//    
//   deleteMaterial = async (
//     req: Request,
//     res: Response
//   ): Promise<Response> => {
//     if (req.user?.role !== "DOCTOR") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const { id } = req.params;
//     if (!id) {
//   return res.status(400).json({ message: "Material ID is required" });
// }

//     const deleted = await this._materialModel.deleteMaterial(id);

//     return res.status(200).json({
//       message: "Material deleted successfully",
//       data: deleted,
//     });
//   };
// }

// export default new MaterialService();
