import express from "express";
import type{ Express,Request,Response } from "express";
import authRouter from "./Modules/Auth/auth.controller"
import userRouter from "./Modules/User/user.controller";
import materialRouter from "./Modules/Materials/materials.controller";
import courseRouter from "./Modules/course/course.controller";
import quizRouter from "./Modules/Quiz/quiz.controller";
import finalExamController from "./Modules/FinalExam/finalExam.controller";
import examMonitoringController from "./Modules/Exam report/examMonitoring.controller";
import academicAdvisingController from "./Modules/AcademicAdvising Module/academicAdvising.controller";

  import extracourseRouter from "./Modules/ExtraCourse/extraCourse.controller";
  import attendaceRouter from "./Modules/Attendace/attendace.controller";
 import registrationRouter from "./Modules/Registration/regstration.controller";
import {glopalErrorhandeler} from "./Uitls/response/error.responsee";
import path from "node:path";
import{config} from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit ,{RateLimitRequestHandler}from "express-rate-limit";
config({path: path.resolve("./config/.env.dev")});
// config({path: path.resolve("./../config/multer.config.ts")});
 import connectDB from "./DB/db.connecion";


const limitter:RateLimitRequestHandler =rateLimit({
    windowMs:15*60*1000,//15 minuts
    limit:100,
    message:{
        status:479,
        message:"too many request from this ip,please try agin latear"
    }
})

export const bootstrap= async():Promise<void>=>{
    const app:Express = express();
    app.set("trust proxy", 1);
    const port:number = Number(process.env.PORT) || 5000;
app.use(limitter);
app.use(cors(),express.json(),helmet());// glopal midelleware
app.use("/uploads",  express.static(path.join(process.cwd(), "uploads")));

await connectDB();

app.get("/users",(req:Request,res:Response)=>{
return res.status(200).json({message:"hello from Express with ts"})
})





app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/course",courseRouter)
app.use("/api/registration", registrationRouter);
app.use("/api/attendace",attendaceRouter);
app.use("/api/materails",materialRouter)
app.use("/api/quiz",quizRouter)
app.use("/api/extracourse",extracourseRouter)
app.use("/api/exam", examMonitoringController);
app.use("/api/finalExam",finalExamController);
app.use("/api/advising",academicAdvisingController);
app.use(glopalErrorhandeler)
    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
        
})
};