import {
  ProjectionType,
  QueryOptions,
} from "mongoose";

import {
  MaterialModel,
  IMaterial,
  MaterialDocument,
} from "../Models/materials.model";

import { DatabaseRepository } from "../../DB/repositories/database.repository";

export class MaterialRepository extends DatabaseRepository<IMaterial> {
  constructor() {
    super(MaterialModel as any);
  }

  async createMaterial(
    data: Partial<IMaterial>[],
    options?: QueryOptions<IMaterial> | any
  ): Promise<MaterialDocument[] | undefined> {
    const result = await this.create({ data, options });
    return result as MaterialDocument[] | undefined;
  }

  async findByCourse(
    courseID: string,
    select: ProjectionType<IMaterial> | null = null,
    options: QueryOptions<IMaterial> | null = null
  ): Promise<MaterialDocument[]> {
    const result = await this.find({
      filter: { courseID },
      select,
      options,
    });

    return result as MaterialDocument[];
  }

  async deleteMaterial(id: string): Promise<any> {
    return await this.deleteOne({ _id: id });
  }
}

export default new MaterialRepository();
