import {
  ProjectionType,
  QueryOptions,
//   UpdateQuery,
  Types,
} from "mongoose";

import {
  QuizModel,
  IQuiz,
  QuizDocument,
} from "../Models/quiz.model";

import { DatabaseRepository } from "./database.repository";

export class QuizRepository extends DatabaseRepository<IQuiz> {
  constructor() {
    super(QuizModel as any);
  }

  async createQuiz(
    data: Partial<IQuiz>[],
    options?: QueryOptions<IQuiz> | any
  ): Promise<QuizDocument[] | undefined> {
    const result = await this.create({ data, options });
    return result as QuizDocument[] | undefined;
  }

  async findByCourse(
    courseID: string,
    select: ProjectionType<IQuiz> | null = null,
    options: QueryOptions<IQuiz> | null = null
  ): Promise<QuizDocument[]> {
    const result = await this.find({
      filter: { courseID },
      select,
      options,
    });
    return result as QuizDocument[];
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<QuizDocument | null> {
    return await this.model.findById(id);
  }

  async deleteQuiz(id: string): Promise<any> {
    return await this.deleteOne({ _id: id });
  }
}


export default new QuizRepository();