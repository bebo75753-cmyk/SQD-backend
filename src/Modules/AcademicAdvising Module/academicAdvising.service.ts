import { Request, Response } from "express";

import AttendanceRepository from "../../DB/repositories/attendace.repository";
import SubmissionRepository from "../../DB/repositories/submission.repository";
import FinalExamRepository from "../../DB/repositories/finalExam.repository";
import RegistrationRepository from "../../DB/repositories/registration.repository";

import {
  BadRequestExption,
  ForbiddenExption,
} from "../../Uitls/response/error.responsee";

export class AcademicAdvisingService {
  private _attendanceModel =
    AttendanceRepository;

  private _quizModel =
    SubmissionRepository;

  private _examModel =
    FinalExamRepository;

  private _registrationModel =
    RegistrationRepository;

  // =========================
  // Helper Functions
  // =========================
  private calculateAverage(arr: number[]) {
    if (!arr.length) return 0;

    return Math.round(
      arr.reduce((a, b) => a + b, 0) /
        arr.length
    );
  }

  private getStatus(avg: number) {
    if (avg >= 85) {
      return {
        status: "EXCELLENT",
        recommendation:
          "Excellent Performance",
      };
    }

    if (avg >= 65) {
      return {
        status: "GOOD",
        recommendation: "Keep Going",
      };
    }

    if (avg >= 50) {
      return {
        status: "WEAK",
        recommendation:
          "Needs More Practice",
      };
    }

    return {
      status: "AT_RISK",
      recommendation:
        "Take Extra Course / Meet Advisor",
    };
  }

  // =========================
  // Student Analysis
  // =========================
  getMyAnalysis = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.user?.UserID) {
      throw new BadRequestExption(
        "User not found"
      );
    }

    const userID = req.user.UserID;

    // Attendance
    const attendance =
      await this._attendanceModel.findByUser(
        userID
      );

    const attendancePercentage =
      attendance.length * 10;

    // Quiz
    const quizzes =
      await this._quizModel.findByStudent(
        userID
      );

    const quizAverage =
      this.calculateAverage(
        quizzes.map((q: any) => q.score)
      );

    // Exams
    const exams =
      await this._examModel.find({
        filter: {},
      });

    const examScores: number[] = [];

    exams.forEach((exam: any) => {
      const mySub =
        exam.submissions.find(
          (s: any) =>
            s.UserID === userID
        );

      if (mySub) {
        examScores.push(mySub.score);
      }
    });

    const examAverage =
      this.calculateAverage(examScores);

    const overallAverage =
      this.calculateAverage([
        attendancePercentage,
        quizAverage,
        examAverage,
      ]);

    const analysis =
      this.getStatus(overallAverage);

    return res.status(200).json({
      attendancePercentage,
      quizAverage,
      examAverage,
      overallAverage,
      ...analysis,
    });
  };

  // =========================
  // Weak Students in Course
  // =========================
  getWeakStudents = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption(
        "Only doctor allowed"
      );
    }

    const { courseID } = req.params;

    const students =
      await this._registrationModel.find({
        filter: { courseID },
      });

    const weakStudents: any[] = [];

    for (const student of students) {
      const attendance =
        await this._attendanceModel.findByUser(
          student.UserID
        );

      const quizzes =
        await this._quizModel.findByStudent(
          student.UserID
        );

      const attendancePercentage =
        attendance.length * 10;

      const quizAverage =
        this.calculateAverage(
          quizzes.map((q: any) => q.score)
        );

      const overall =
        this.calculateAverage([
          attendancePercentage,
          quizAverage,
        ]);

      const status =
        this.getStatus(overall);

      if (
        status.status === "WEAK" ||
        status.status === "AT_RISK"
      ) {
        weakStudents.push({
          UserID: student.UserID,
          overall,
          status: status.status,
        });
      }
    }

    return res.status(200).json({
      count: weakStudents.length,
      data: weakStudents,
    });
  };

  // =========================
  // Course Statistics
  // =========================
  getCourseStats = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption(
        "Only doctor allowed"
      );
    }

    const { courseID } = req.params;

    const students =
      await this._registrationModel.find({
        filter: { courseID },
      });

    const totalStudents =
      students.length;

    let totalAttendance = 0;
    let totalGrades = 0;

    for (const student of students) {
      const attendance =
        await this._attendanceModel.findByUser(
          student.UserID
        );

      const quizzes =
        await this._quizModel.findByStudent(
          student.UserID
        );

      totalAttendance +=
        attendance.length * 10;

      totalGrades +=
        this.calculateAverage(
          quizzes.map((q: any) => q.score)
        );
    }

    return res.status(200).json({
      totalStudents,

      averageAttendance:
        totalStudents === 0
          ? 0
          : Math.round(
              totalAttendance /
                totalStudents
            ),

      averageGrades:
        totalStudents === 0
          ? 0
          : Math.round(
              totalGrades /
                totalStudents
            ),
    });
  };
}

export default new AcademicAdvisingService();