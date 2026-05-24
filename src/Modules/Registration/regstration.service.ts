import { Request, Response } from "express";
import RegistrationRepository from "../../DB/repositories/registration.repository";
import { BadRequestExption, NotFoundExption } from "../../Uitls/response/error.responsee";
// import { RegistrationStatusEnum } from "../../DB/Models/registration.model ";
//محتاج تيست 
export class RegistrationService {
  private _registrationModel = RegistrationRepository;

  /**
   * Create Registration
   */
  createRegistration = async (req: Request, res: Response): Promise<Response> => {
    const { UserID, courseID, semester } = req.body;

    // check if exists already
    const exists = await this._registrationModel.isStudentRegistered(
      UserID,
      courseID,
      semester
    );

    if (exists) {
      throw new BadRequestExption(
        "Student already registered for this course in this semester"
      );
    }

    const created = await this._registrationModel.createRegistration([
      { UserID, courseID, semester},
      //status: RegistrationStatusEnum.PENDING 
    ]);

    return res.status(201).json({
      message: "Registration created successfully",
      data: created,
    });
  };

  /**
   *  Cancel Registration
   */
  cancelRegistration = async (req: Request, res: Response): Promise<Response> => {
    const { UserID, courseID, semester } = req.params;

if (!UserID || !courseID || !semester) {
  return res.status(400).json({ message: 'Missing params' });
}

console.log({
  UserID,
  courseID,
  semester,
});

    const deleted = await this._registrationModel.deleteRegistration(
      UserID,
      courseID,
      Number(semester)
    );

    if (!deleted || deleted.deletedCount === 0) {
      throw new NotFoundExption("Registration not found or already canceled");
    }

    return res.status(200).json({
      message: "Registration canceled successfully",
    });
  };

  /**
   *  Approve or Reject
   */
  approveOrReject = async (req: Request, res: Response): Promise<Response> => {
    const { UserID, courseID, semester, status } = req.body;

    const registration = await this._registrationModel.findByStudentAndCourse(
      UserID,
      courseID,
      semester
    );

    if (!registration) {
      throw new NotFoundExption("Registration not found");
    }

    const updated = await this._registrationModel.updateRegistration(
      registration._id,
      { status }
    );

    return res.status(200).json({
      message: `Registration ${status.toLowerCase()} successfully`,
      data: updated,
    });
  };

  /**
   *  Get Student Registrations
   */
  getStudentRegistrations = async (req: Request, res: Response): Promise<Response> => {
    const { UserID } = req.params;
    if(!UserID)
 return res.status(400).json({ message: 'Missing params' });
    const result = await this._registrationModel.findByStudent(UserID);

    return res.status(200).json({
      message: "Student registrations fetched successfully",
      data: result,
    });
  };

  /**
   *  Get Course Registrations
   */
  getCourseRegistrations = async (req: Request, res: Response): Promise<Response> => {
    const { courseID } = req.params;
    const semester = req.query.semester ? Number(req.query.semester) : undefined;

    if (semester) {
      const result = await this._registrationModel.find({
        filter: { courseID, semester },
      });

      return res.status(200).json({
        message: "Course registrations fetched successfully",
        data: result,
      });
    }
 if(!courseID)
   return res.status(400).json({ message: 'Missing params courseID' });
    const result = await this._registrationModel.findByCourse(courseID);

    return res.status(200).json({
      message: "Course registrations fetched successfully",
      data: result,
    });
  };
}

export default new RegistrationService();


// import { Request, Response } from "express";
// import RegistrationRepository from "../../DB/repositories/registration.repository";
// import { BadRequestExption, NotFoundExption } from "../../Uitls/response/error.responsee";
// // import { RegistrationStatusEnum } from "../../DB/Models/registration.model ";


// export class RegistrationService {
//   private _registrationModel = RegistrationRepository;

//   /**
//    * ➕ Create new registration (Student registers in a course)
//    */
//   createRegistration = async (req: Request, res: Response): Promise<Response> => {
//     const body = req.body;

//     const exists = await this._registrationModel.isStudentRegistered(
//       body.UserID,
//       body.courseID,
//       body.semester
//     );

//     if (exists) throw new BadRequestExption("Student already registered in this course for this semester");

//     const created = await this._registrationModel.createRegistration([body]);

//     return res.status(201).json({
//       message: "Registration created successfully",
//       data: created,
//     });
//   };

//   /**
//    * ❌ Cancel registration (student can cancel before approval)
//    */
//   cancelRegistration = async (req: Request, res: Response): Promise<Response> => {
//     const { UserID, courseID, semester } = req.params;

//     const deleted = await this._registrationModel.deleteOne({filter:{  UserID,
//       courseID,
//       semester }}
    
//     );

//     if (!deleted || deleted.deletedCount === 0)
//       throw new NotFoundExption("Registration not found or already canceled");

//     return res.status(200).json({ message: "Registration canceled successfully" });
//   };

//   /**
//    * ✔ Approve or Reject registration (Doctor)
//    */
//   approveOrReject = async (req: Request, res: Response): Promise<Response> => {
//     const { UserID, courseID, semester, status } = req.body;

//     const registration = await this._registrationModel.findByStudentAndCourse(
//       UserID,
//       courseID,
//       semester
//     );

//     if (!registration) throw new NotFoundExption("Registration not found");

//     const updated = await this._registrationModel.updateRegistration(
//       registration._id,
//       { status }
//     );

//     return res.status(200).json({
//       message: `Registration ${status.toLowerCase()} successfully`,
//       data: updated,
//     });
//   };

//   /**
//    * 🎓 Get all registrations for a student
//    */
//   getStudentRegistrations = async (req: Request, res: Response): Promise<Response> => {
//     const { UserID } = req.params;

//     const result = await this._registrationModel.findOne({filter:{UserID:UserID}});

//     return res.status(200).json({
//       message: "Student registrations fetched successfully",
//       data: result,
//     });
//   };

//   /**
//    * 📘 Get all registrations for a specific course
//    */
//   getCourseRegistrations = async (req: Request, res: Response): Promise<Response> => {
//     const { courseID } = req.params;
//     const semester = req.query.semester ? Number(req.query.semester) : undefined;

//     let result;

//     if (semester) {
//       result = await this._registrationModel.find({
//         filter: { courseID, semester },
//       });
//     } else {
//       result = await this._registrationModel.findOne({filter:{courseID:courseID}});
//     }

//     return res.status(200).json({
//       message: "Course registrations fetched successfully",
//       data: result,
//     });
//   };
// }

// export default new RegistrationService();
