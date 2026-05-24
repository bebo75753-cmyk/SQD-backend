import { Request, Response } from "express";
import FinalExamRepository from "../../DB/repositories/finalExam.repository";
import ExamMonitoringRepository from "../../DB/repositories/examMonitoring.repository";

import {
  BadRequestExption,
  ForbiddenExption,
} from "../../Uitls/response/error.responsee";

export class FinalExamService {
  private _examModel = FinalExamRepository;
  private _examSessionModel = ExamMonitoringRepository; // 🔗 ربط مع Phase 5

  // =====================
  // Create Exam (Doctor)
  // =====================
  createExam = async (req: Request, res: Response) => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Only doctor allowed");
    }

    const created = await this._examModel.createExam([
      {
        ...req.body,
        createdBy: req.user.UserID,
      },
    ]);

    return res.status(201).json({
      message: "Exam created successfully",
      data: created,
    });
  };

  // =====================
  // Get Exam (Student)  **
  // =====================
  getExam = async (req: Request, res: Response) => {
    const { examID } = req.params;
if(!examID){
    throw new BadRequestExption("not found examID ")
}
    const exam = await this._examModel.findById(examID);

    if (!exam) {
      throw new BadRequestExption("Exam not found");
    }

    // نخفي الإجابة الصح
    const questions = exam.questions.map((q: any) => ({
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
    }));

    return res.status(200).json({
      title: exam.title,
      duration: exam.duration,
      questions,
    });
  };

  // =====================
  // Submit Exam (Student)
  // =====================
  submitExam = async (req: Request, res: Response) => {
    if (req.user?.role !== "STUDENT") {
      throw new ForbiddenExption("Only student allowed");
    }

    const { examID, answers } = req.body;

    const exam = await this._examModel.findById(examID);

    if (!exam) {
      throw new BadRequestExption("Exam not found");
    }

    //  نجيب session من Phase 5
    const session = await this._examSessionModel.findSession(
      req.user.UserID,
      examID
    );

    if (!session) {
      throw new BadRequestExption("Exam not started");
    }

    // ⏱ حساب الوقت
    const startTime = new Date(session.startTime);
    const now = new Date();

    const diffMinutes =
      (now.getTime() - startTime.getTime()) / (1000 * 60);

    //  لو الوقت خلص
    if (diffMinutes > exam.duration) {
      throw new BadRequestExption("Time is over");
    }

    // حساب الدرجة
    let score = 0;

    exam.questions.forEach((q: any, index: number) => {
      const ans = answers.find(
        (a: any) => a.questionIndex === index
      );

      if (ans?.selectedAnswer === q.correctAnswer) {
        score += q.marks;
      }
    });

    const updated =
      await this._examModel.addSubmission(examID, {
        UserID: req.user.UserID,
        answers,
        score,
      });

    return res.status(200).json({
      message: "Exam submitted successfully",
      score,
      data:updated,
    });
  };

  // =====================
  // Doctor Results
  // =====================
  getResults = async (req: Request, res: Response) => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Only doctor allowed");
    }

    const { examID } = req.params;
if(!examID){
    throw new BadRequestExption("not found examID ");
}
    const exam = await this._examModel.findById(examID);

    return res.status(200).json({
      data: exam?.submissions || [],
    });
  };

  // =====================
  // Student Result
  // =====================
  getMyResult = async (req: Request, res: Response) => {
    const { examID } = req.params;
if(!examID){
    throw new BadRequestExption("not found examID ");
}
    const exam = await this._examModel.findById(examID);

    const my = exam?.submissions.find(
      (s: any) => s.UserID === req.user?.UserID
    );

    return res.status(200).json({
      data: my,
    });
  };
}

export default new FinalExamService();