import { Request, Response } from "express";
import AttendanceRepository from "../../DB/repositories/attendace.repository";
import {
  BadRequestExption,
  NotFoundExption,
  
} from "../../Uitls/response/error.responsee";

export class AttendanceService {
  private _attendanceModel = AttendanceRepository;

  // Record Attendance (AI)
  recordAttendance = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { courseID, date, attendances } = req.body;

    if (!courseID || !date || !attendances || !Array.isArray(attendances)) {
      throw new BadRequestExption("Invalid attendance payload");
    }

    const existing = await this._attendanceModel.find({
      filter: { courseID, date },
    });

    const existingUserIDs = new Set(
      existing.map((item: any) => item.UserID)
    );

    const recordsToInsert = attendances
      .filter((student: any) => student.UserID && student.status)
      .filter((student: any) => !existingUserIDs.has(student.UserID))
      .map((student: any) => ({
        UserID: student.UserID,
        courseID,
        date,
        status: student.status,
      }));

    if (recordsToInsert.length === 0) {
      throw new BadRequestExption(
        "No new attendance records to insert"
      );
    }

    const created = await this._attendanceModel.createAttendance(
      recordsToInsert
    );

    return res.status(201).json({
      message: "Attendance batch recorded successfully",
      insertedCount: created?.length || 0,
      data: created,
    });
  };

  // Get Student Attendance
  getStudentAttendance = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const LoggedUserID = req.user?.UserID;

    if (!LoggedUserID) {
      throw new BadRequestExption("User not authenticated");
    }

    const result =
      await this._attendanceModel.findByUser(LoggedUserID);

    return res.status(200).json({
      message: "Student attendance fetched successfully",
      data: result,
    });
  };

  //  Get Course Attendance (Doctor Dashboard)
  getCourseAttendance = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { courseID } = req.params;
    const { date } = req.query as any;

    if (!courseID || !date) {
      throw new BadRequestExption(
        "courseID and date are required"
      );
    }

    const result =
      await this._attendanceModel.findByCourseAndDate(
        courseID,
        date
      );

    if (!result || result.length === 0) {
      throw new NotFoundExption(
        "No attendance records found"
      );
    }

    return res.status(200).json({
      message: "Course attendance fetched successfully",
      data: result,
    });
  };

  // Get Student Attendance Percentage (Doctor Only)
  getStuAttenPercDoctor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { courseID, UserID } = req.params;

    if (!courseID || !UserID) {
      throw new BadRequestExption("Missing required params");
    }

    if (req.user?.role !== "DOCTOR") {
      throw new BadRequestExption("Access denied");
    }

    const totalLectures =
      await this._attendanceModel.getDistinctLectureDates(
        courseID
      );

    const totalCount = totalLectures.length;

    const attended =
      await this._attendanceModel.countStudentAttendance(
        UserID,
        courseID
      );

    const percentage =
      totalCount === 0
        ? 0
        : Math.round((attended / totalCount) * 100);

    return res.status(200).json({
      courseID,
      UserID,
      totalLectures: totalCount,
      attendedLectures: attended,
      attendancePercentage: percentage,
    });
  };
}

export default new AttendanceService();





// import { Request, Response } from "express";
// import AttendanceRepository from "../../DB/repositories/attendace.repository";
// import {
//   BadRequestExption,
//   NotFoundExption,
// } from "../../Uitls/response/error.responsee";

// export class AttendanceService {
//   private _attendanceModel = AttendanceRepository;

 
//     // Record Attendance (AI)
//     recordAttendance = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { courseID, date, attendances } = req.body;

//   if (!courseID || !date || !attendances || !Array.isArray(attendances)) {
//     return res.status(400).json({ message: "Missing body data" });
//   }

//   //  هات الطلبة المسجلين قبل كده في نفس اليوم
//   const existing = await this._attendanceModel.find({
//     filter: { courseID, date },
//   });
// // هنا هيقارن مين موجد واتسجل قبل كده ولا لا
//   const existingUserIDs = new Set(existing.map((item: any) => item.UserID));

//   const recordsToInsert = attendances
//     .filter((student: any) => student.UserID && student.status)
//     .filter((student: any) => !existingUserIDs.has(student.UserID))
//     .map((student: any) => ({
//       UserID: student.UserID,
//       courseID,
//       date,
//       status: student.status,
//     }));

//   if (recordsToInsert.length === 0) {
//     throw new BadRequestExption("No new attendance records to insert");
//   }

//   const created = await this._attendanceModel.createAttendance(
//     recordsToInsert
//   );

//   return res.status(201).json({
//     message: "Attendance batch recorded successfully",
//     insertedCount: created?.length || 0,
//     data: created,
//   });
// };

  
//     //  Get Student Attendance
 
//   getStudentAttendance = async (
//     req: Request,
//     res: Response
//   ): Promise<Response> => {
//     const LoggedUserID = req.user?.UserID;

//     if (!LoggedUserID) {
//       return res.status(400).json({ message: "Missing params UserID" });
//     }

//     const result = await this._attendanceModel.findByUser(LoggedUserID);

//     return res.status(200).json({
//       message: "Student attendance fetched successfully",
//       data: result,
//     });
//   };

  
//    // Get Course Attendance (Doctor Dashboard)
 
//   getCourseAttendance = async (
//     req: Request,
//     res: Response
//   ): Promise<Response> => {
//     const { courseID } = req.params;
//     const { date } = req.query as any;

//     if (!courseID || !date) {
//       return res.status(400).json({
//         message: "Missing params courseID or date",
//       });
//     }

//     const result = await this._attendanceModel.findByCourseAndDate(
//       courseID,
//       date
//     );

//     if (!result || result.length === 0) {
//       throw new NotFoundExption("No attendance records found");
//     }

//     return res.status(200).json({
//       message: "Course attendance fetched successfully",
//       data: result,
//     });
//   };
  
//   //
//  getStuAttenPercDoctor = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { courseID, UserID } = req.params;

//   if (!courseID || !UserID) {
//     return res.status(400).json({ message: "Missing params" });
//   }

//   if (req.user?.role !== "DOCTOR") {
//     return res.status(403).json({ message: "Forbidden" });
//   }

//   const totalLectures =
//     await this._attendanceModel.getDistinctLectureDates(courseID);

//   const totalCount = totalLectures.length;

//   const attended =
//     await this._attendanceModel.countStudentAttendance(
//       UserID,
//       courseID
//     );

//   const percentage =
//     totalCount === 0 ? 0 : Math.round((attended / totalCount) * 100);

//   return res.status(200).json({
//     courseID,
//     UserID,
//     totalLectures: totalCount,
//     attendedLectures: attended,
//     attendancePercentage: percentage,
//   });
// };


// }

// export default new AttendanceService();
