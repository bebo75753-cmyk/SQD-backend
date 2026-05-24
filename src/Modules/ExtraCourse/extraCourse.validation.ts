import { z } from "zod";

export const createExtraCourseSchema = {
body: z.object({
title: z.string(),
description: z.string().optional(),
platform: z.string().optional(),
url: z.string().url(),
}),
};

export const deleteExtraCourseSchema = {
params: z.object({
id: z.string(),
}),
};