import { DatabaseRepository } from "./database.repository";
import { FinalExamModel, IFinalExam } from "../Models/finalExam.model";

export class FinalExamRepository extends DatabaseRepository<IFinalExam> {
  constructor() {
    super(FinalExamModel as any);
  }

  async createExam(data: Partial<IFinalExam>[]) {
    return await this.create({ data });
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async addSubmission(examID: string, submission: any) {
    return await this.model.findByIdAndUpdate(
      examID,
      {
        $push: { submissions: submission },
      },
      { new: true }
    );
  }
}

export default new FinalExamRepository();