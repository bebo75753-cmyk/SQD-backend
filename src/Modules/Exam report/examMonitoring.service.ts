import { Request, Response } from "express";

import ExamMonitoringRepository, {
  ExamBehaviorRepository,
} from "../../DB/repositories/examMonitoring.repository";

import {
  BadRequestExption,
  NotFoundExption,
  ForbiddenExption,
} from "../../Uitls/response/error.responsee";

export class ExamMonitoringService {
  private _examModel = ExamMonitoringRepository;
  private _behaviorModel = ExamBehaviorRepository;

  // =====================
  // Start Exam
  // =====================
  startExam = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.user?.UserID) {
      throw new BadRequestExption("User not found");
    }

    const { examID } = req.body;

    const exists = await this._examModel.findSession(
      req.user.UserID,
      examID
    );

    if (exists) {
      throw new BadRequestExption(
        "Exam session already started"
      );
    }

    const created = await this._examModel.createSession([
      {
        UserID: req.user.UserID,
        examID,
      },
    ]);

    return res.status(201).json({
      message: "Exam started successfully",
      data: created,
    });
  };

  // =====================
  // Record Behavior
  // =====================
  recordBehavior = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.user?.UserID) {
      throw new BadRequestExption("User not found");
    }
if (req.user.role !== "STUDENT") {
  throw new ForbiddenExption("Only students allowed");
}
    const { examID, type } = req.body;

    // تأكد إن فيه session شغال
    const session = await this._examModel.findSession(
      req.user.UserID,
      examID
    );

    if (!session) {
      throw new NotFoundExption(
        "Exam session not started"
      );
    }

    // تأكد إنه لسه منتهيش
    if (session.endTime) {
      throw new BadRequestExption(
        "Exam already ended"
      );
    }

    const behavior =
      await this._behaviorModel.createBehavior([
        {
          UserID: req.user.UserID,
          examID,
          type,
        },
      ]);

    return res.status(201).json({
      message: "Behavior recorded successfully",
      data: behavior,
    });
  };

  // =====================
  // End Exam
  // =====================
  endExam = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user?.UserID) {
    throw new BadRequestExption("User not found");
  }

  const { examID } = req.body;

  const session = await this._examModel.findSession(
    req.user.UserID,
    examID
  );

  if (!session) {
    throw new NotFoundExption("Exam session not found");
  }

  // المهم
  if (session.endTime) {
    throw new BadRequestExption("Exam already ended");
  }

  const updated = await this._examModel.endSession(
    req.user.UserID,
    examID
  );

  return res.status(200).json({
    message: "Exam ended successfully",
    data: updated,
  });
};
//   endExam = async (
//     req: Request,
//     res: Response
//   ): Promise<Response> => {
//     if (!req.user?.UserID) {
//       throw new BadRequestExption("User not found");
//     }

//     const { examID } = req.body;

//     const session =
//       await this._examModel.endSession(
//         req.user.UserID,
//         examID
//       );

//     if (!session) {
//       throw new NotFoundExption(
//         "Exam session not found"
//       );
//     }

//     return res.status(200).json({
//       message: "Exam ended successfully",
//       data: session,
//     });
//   };

  // =====================
  // Doctor Report (كل الطلاب)
  // =====================
  getExamReport = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Forbidden");
    }

    const { examID } = req.params;
 if (!examID)
    { throw new BadRequestExption("Exam ID is required");

    }
    const report =
      await this._behaviorModel.findByExam(examID);

    return res.status(200).json({
      message: "Exam report fetched successfully",
      totalViolations: report.length,
      data: report,
    });
  };

  // =====================
  // Student Report (اختياري)
  // =====================
  getMyExamReport = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.user?.UserID) {
      throw new BadRequestExption("User not found");
    }

    const { examID } = req.params;

    const report =
      await this._behaviorModel.find({
        filter: {
          examID,
          UserID: req.user.UserID,
        },
      });

    return res.status(200).json({
      message: "Student exam report fetched",
      data: report,
    });
  };
}

export default new ExamMonitoringService();