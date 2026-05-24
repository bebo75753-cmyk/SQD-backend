import {
  // ProjectionType,
  QueryOptions,
} from "mongoose";

import {
  ExamSessionModel,
  IExamSession,
  ExamSessionDocument,
} from "../Models/examSession.model";

import {
  ExamBehaviorModel,
  IExamBehavior,
  ExamBehaviorDocument,
} from "../Models/examBehavior.model";

import { DatabaseRepository } from "./database.repository";

// =======================
// Exam Session Repository
// =======================

export class ExamMonitoringRepository extends DatabaseRepository<IExamSession> {
  constructor() {
    super(ExamSessionModel as any);
  }

  async createSession(
    data: Partial<IExamSession>[],
    options?: QueryOptions<IExamSession> | any
  ): Promise<ExamSessionDocument[] | undefined> {
    const result = await this.create({ data, options });
    return result as ExamSessionDocument[] | undefined;
  }

  async endSession(UserID: string, examID: string) {
    return await this.model.findOneAndUpdate(
      { UserID, examID },
      { endTime: new Date() },
      { new: true }
    );
  }

  async findSession(UserID: string, examID: string) {
    return await this.findOne({
      filter: { UserID, examID },
    });
  }
}

// =======================
// Exam Behavior Repository ✅
// =======================

export class ExamBehaviorRepo extends DatabaseRepository<IExamBehavior> {
  constructor() {
    super(ExamBehaviorModel as any);
  }

  async createBehavior(
    data: Partial<IExamBehavior>[]
  ): Promise<ExamBehaviorDocument[] | undefined> {
    const result = await this.create({ data });
    return result as ExamBehaviorDocument[] | undefined;
  }

  async findByExam(examID: string) {
    return await this.find({
      filter: { examID },
    });
  }
}

// =======================
// Exports
// =======================

export const ExamBehaviorRepository = new ExamBehaviorRepo();

export default new ExamMonitoringRepository();