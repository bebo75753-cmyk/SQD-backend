import { DatabaseRepository } from "./database.repository";
import {
  SubmissionModel,
  ISubmission,
  SubmissionDocument,
} from "../Models/submission.model";

export class SubmissionRepository extends DatabaseRepository<ISubmission> {
  constructor() {
    super(SubmissionModel as any);
  }

  async createSubmission(
    data: Partial<ISubmission>[]
  ): Promise<SubmissionDocument[] | undefined> {
    return (await this.create({ data })) as
      | SubmissionDocument[]
      | undefined;
  }

  //  جلب كل نتائج الطالب
  async findByStudent(UserID: string) {
    return await this.find({ filter: { UserID } });
  }

  //  التحقق هل الطالب سلم الكويز قبل كده
  async findByQuizAndStudent(
    quizID: string,
    UserID: string
  ): Promise<SubmissionDocument | null> {
    const result = await this.findOne({
      filter: { quizID, UserID },
    });

    return result as SubmissionDocument | null;
  }

  //  جلب كل النتائج الخاصة بكويز معين (للدكتور)
  async findByQuiz(quizID: string) {
    return await this.find({
      filter: { quizID },
    });
  }
}

export default new SubmissionRepository();

// import { DatabaseRepository } from "./database.repository";
// import {
//   SubmissionModel,
//   ISubmission,
//   SubmissionDocument,
// } from "../Models/submission.model";

// export class SubmissionRepository extends DatabaseRepository<ISubmission> {
//   constructor() {
//     super(SubmissionModel as any);
//   }

//   async createSubmission(
//     data: Partial<ISubmission>[]
//   ): Promise<SubmissionDocument[] | undefined> {
//     return (await this.create({ data })) as
//       | SubmissionDocument[]
//       | undefined;
//   }

//   async findByStudent(UserID: string) {
//     return await this.find({ filter: { UserID } });
//   }
// }

// export default new SubmissionRepository();