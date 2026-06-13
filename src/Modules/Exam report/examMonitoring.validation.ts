import { z } from "zod";

export const startExamSchema = {
  body: z.object({
    examID: z.string(),
  }),
};
export const createExamBehaviorSchema = {
  body: z.object({
    examID: z.string(),

    behaviors: z.array(
      z.object({
        UserID: z.string().regex(/^STU\d+$/),

        type: z.enum([
          "TAB_SWITCH",
          "MULTIPLE_FACES",
          "LOOKING_AWAY",
          "SCREEN_EXIT",
        ]),
      })
    ),
  }),
};
// export const recordBehaviorSchema = {
//   body: z.object({
//     examID: z.string(),
//     type: z.enum([
//       "TAB_SWITCH",
//       "MULTIPLE_FACES",
//       "LOOKING_AWAY",
//       "SCREEN_EXIT",
//     ]),
//   }),
// };
// export const createExamBehaviorSchema = {
//   body: z.object({
//     examID: z.string(),

//     behaviors: z.array(
//       z.object({
//         UserID: z.string().regex(/^STU\d+$/),

//         type: z.enum([
//           "TAB_SWITCH",
//           "MULTIPLE_FACES",
//           "LOOKING_AWAY",
//           "SCREEN_EXIT",
//         ]),
//       })
//     ),
//   }),
// };
export const endExamSchema = {
  body: z.object({
    examID: z.string(),
  }),
};

export const getReportSchema = {
  params: z.object({
    examID: z.string(),
  }),
};