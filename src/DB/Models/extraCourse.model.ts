import { Schema, model, models, HydratedDocument } from "mongoose";

export interface IExtraCourse {
title: string;
description?: string;
platform?: string;
url: string;
createdAt?: Date;
updatedAt?: Date;
}

export type ExtraCourseDocument =
HydratedDocument<IExtraCourse>;

const extraCourseSchema = new Schema<IExtraCourse>(
{
title: {
type: String,
required: true,
trim: true,
},

description: {
type: String,
},

platform: {
type: String,
},

url: {
type: String,
required: true,
},
},
{
timestamps: true,
}
);

export const ExtraCourseModel =
models.ExtraCourse ||
model<IExtraCourse>("ExtraCourse", extraCourseSchema);