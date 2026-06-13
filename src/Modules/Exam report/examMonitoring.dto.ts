import { z } from "zod";

import {
  startExamSchema,
  endExamSchema,
  getReportSchema,
  createExamBehaviorSchema,
} from "./examMonitoring.validation";

export type IStartExamDto =
  z.infer<typeof startExamSchema.body>;

export type ICreateExamBehaviorDto =
  z.infer<
    typeof createExamBehaviorSchema.body
  >;

export type IEndExamDto =
  z.infer<typeof endExamSchema.body>;

export type IGetReportDto =
  z.infer<typeof getReportSchema.params>;


// import { z } from "zod";

// import {
//   startExamSchema,
//   recordBehaviorSchema,
//   endExamSchema,
//   getReportSchema,
//   createExamBehaviorSchema
// } from "./examMonitoring.validation";

// export type IStartExamDto =
//   z.infer<typeof startExamSchema.body>;
// export type ICreateExamBehaviorDto =
//   z.infer<
//     typeof createExamBehaviorSchema.body
//   >;
  
// // export type IRecordBehaviorDto =
// //   z.infer<typeof recordBehaviorSchema.body>;

// export type IEndExamDto =
//   z.infer<typeof endExamSchema.body>;

// export type IGetReportDto =
//   z.infer<typeof getReportSchema.params>;