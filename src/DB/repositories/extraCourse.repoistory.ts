import {
ProjectionType,
QueryOptions,
} from "mongoose";

import {
ExtraCourseModel,
IExtraCourse,
ExtraCourseDocument,
} from "../Models/extraCourse.model";

import { DatabaseRepository } from "./database.repository";

export class ExtraCourseRepository
extends DatabaseRepository<IExtraCourse> {

constructor() {
super(ExtraCourseModel as any);
}

async createCourse(
data: Partial<IExtraCourse>[],
options?: QueryOptions<IExtraCourse> | any
): Promise<ExtraCourseDocument[] | undefined> {

const result = await this.create({ data, options });

return result as ExtraCourseDocument[] | undefined;
}

async findCourses(
select: ProjectionType<IExtraCourse> | null = null,
options: QueryOptions<IExtraCourse> | null = null
): Promise<ExtraCourseDocument[]> {

const result = await this.find({
filter: {},
select,
options,
});

return result as ExtraCourseDocument[];
}

async deleteCourse(id: string): Promise<any> {
return await this.deleteOne({ _id: id });
}

}

export default new ExtraCourseRepository();