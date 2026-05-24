import { Request, Response } from "express";
import QuizRepository from "../../DB/repositories/quiz.repository";
import SubmissionRepository from "../../DB/repositories/submission.repository";
import {
   BadRequestExption,
  NotFoundExption,
  ForbiddenExption,
} from "../../Uitls/response/error.responsee";

export class QuizService {
  private _quizModel = QuizRepository;
private _submissionModel = SubmissionRepository;
  // ➕ Create Quiz (Doctor Only)
  createQuiz = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Access denied");
    }

    const { title, courseID, duration, totalMarks, questions } =
      req.body;

    const created = await this._quizModel.createQuiz([
      {
        title,
        courseID,
        duration,
        totalMarks,
        questions,
        createdBy: req.user.UserID,
      },
    ]);

    return res.status(201).json({
      message: "Quiz created successfully",
      data: created,
    });
  };

  //  Get Quiz By ID (Student or Doctor)
  getQuizById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;

if (!id) {
  throw new BadRequestExption("Quiz ID is required");
}

const quiz = await this._quizModel.findById(id);
    // hide correct answers for students
    if(!quiz){
        throw new NotFoundExption("Quiz not found");
    }
    if (req.user?.role === "STUDENT") {
      const safeQuiz = {
        ...quiz.toObject(),
        questions: quiz.questions.map((q) => ({
          questionText: q.questionText,
          type: q.type,
          options: q.options,
          marks: q.marks,
        })),
      };

      return res.status(200).json({
        message: "Quiz fetched successfully",
        data: safeQuiz,
      });
    }

    return res.status(200).json({
      message: "Quiz fetched successfully",
      data: quiz,
    });
  };

  // ❌ Delete Quiz (Doctor Only)
  deleteQuiz = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.user?.role !== "DOCTOR") {
      throw new ForbiddenExption("Access denied");
    }

    const { id } = req.params;
if (!id) {
  throw new BadRequestExption("Quiz ID is required");
}

    const deleted = await this._quizModel.deleteQuiz(id);

    if (!deleted || deleted.deletedCount === 0) {
      throw new NotFoundExption("Quiz not found");
    }

    return res.status(200).json({
      message: "Quiz deleted successfully",
    });
  };

  // submition quiz
  submitQuiz = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.user?.role !== "STUDENT") {
    throw new ForbiddenExption("Only students can submit quizzes");
  }

  const { quizID, answers } = req.body;

  if (!quizID || !answers) {
    throw new BadRequestExption("Invalid submission data");
  }

  const quiz = await this._quizModel.findById(quizID);

  if (!quiz) {
    throw new NotFoundExption("Quiz not found");
  }

  let score = 0;

  quiz.questions.forEach((question, index) => {
    const studentAnswer = answers.find(
      (a: any) => a.questionIndex === index
    );

    if (
      studentAnswer &&
      studentAnswer.selectedAnswer === question.correctAnswer
    ) {
      score += question.marks;
    }
  });

  const submission =
    await this._submissionModel.createSubmission([
      {
        quizID,
        UserID: req.user.UserID,
        answers,
        score,
      },
    ]);

  return res.status(200).json({
    message: "Quiz submitted successfully",
    score,
    data: submission,
  });
};
//الطالب يشوف نتائجه
getMyResults = async (
  req: Request,
  res: Response
): Promise<Response> => {

  if (req.user?.role !== "STUDENT") {
    throw new ForbiddenExption("Only students can view results");
  }

  const results =
    await this._submissionModel.findByStudent(
      req.user.UserID
    );

  return res.status(200).json({
    message: "Student results fetched successfully",
    data: results,
  });
};
// الدكتور يشوف نتائج ال quiz
getQuizResults = async (
  req: Request,
  res: Response
): Promise<Response> => {

  if (req.user?.role !== "DOCTOR") {
    throw new ForbiddenExption("Only doctor can view results");
  }
const { quizID } = req.params;

  if (!quizID) {
    throw new BadRequestExption("Quiz ID is required");
  }

  const quiz = await this._quizModel.findById(quizID);

  if (!quiz) {
    throw new NotFoundExption("Quiz not found");
  }

  const results =
    await this._submissionModel.findByQuiz(quizID);

  // const { quizID } = req.params;

  // const quiz = await this._quizModel.findById(quizID);

  // if (!quiz) {
  //   throw new NotFoundExption("Quiz not found");
  // }

  // const results =
  //   await this._submissionModel.findByQuiz(quizID);

  return res.status(200).json({
    message: "Quiz results fetched successfully",
    totalSubmissions: results.length,
    data: results,
  });
};
}

export default new QuizService();