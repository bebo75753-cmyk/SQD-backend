//  src/midellware/authuntacation.middleware.ts

import { Request, Response, NextFunction } from "express";
import { BadRequestExption } from "../Uitls/response/error.responsee";
import { decodedToken } from "../Uitls/token/token";
import { UserRepository } from "../DB/repositories/user.repository";
import { UserModel } from "../DB/Models/user.model";

const userRepo = new UserRepository(UserModel);
export const authentacation = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new BadRequestExption("Missing authorization header");

      //  فك التوكن (ارجع المتغيرات الحقيقية اللي دالتك بترجعها)
      const { userData } = await decodedToken({ authorization: authHeader });

      if (!userData || !userData.UserID)
        throw new BadRequestExption("Invalid or expired token");

      //  جلب المستخدم من قاعدة البيانات
       const user = await userRepo.findByUserID(userData.UserID);
    if (!user) throw new BadRequestExption("User not found");

      //  حفظ بيانات المستخدم في req
      req.user = user;
      req.decoded = userData;

      next();
    } catch (err) {
      next(err);
    }
  };
  
};
//  AI AUTH (API KEY) attendace to reviced AI
// =======================
export const aiAuthentication = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      throw new BadRequestExption("Missing AI API key");
    }

    if (apiKey !== process.env.AI_API_KEY) {
      throw new BadRequestExption("Invalid AI API key");
    }

    next();}
  };


// export const authentacation = () => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.headers.authorization)
//       throw new BadRequestExption("Missing authorization header");

//     const { decoded, userData } = await decodedToken({
//       authorization: req.headers.authorization,
//     });

//     //  استدعاء الميثود اللي انت عاملها
//     const user = await userRepo.findByUserID(userData.UserID);
//     if (!user) throw new NotFoundExption("User not found");

    // req.user = user;
    // req.decoded = decoded;

//     next();
//   };
// };




// import { Request, Response, NextFunction } from "express";
// import { BadRequestExption, NotFoundExption } from "../Uitls/response/error.responsee";
// import { decodedToken } from "../Uitls/token/token";
// import { UserModel } from "../DB/Models/user.model";
// import { UserRepository } from "../DB/repositories/user.repository";
// /**
//  *  Authentication Middleware
//  */
// export const authentacation = () => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) throw new BadRequestExption("Missing authorization header");

//       // فك التوكن (ارجع المتغيرات الحقيقية اللي دالتك بترجعها)
//       const { userData } = await decodedToken({ authorization: authHeader });

//       if (!userData || !userData.UserID)
//         throw new BadRequestExption("Invalid or expired token");

//       //  جلب المستخدم من قاعدة البيانات
//       const user = await UserModel.findB({ UserID: userData.UserID }).exec();
//       if (!user) throw new NotFoundExption("User not found");

//       //  حفظ بيانات المستخدم في req
//       req.user = user;
//       req.decoded = userData;

//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

    
    
    // import { Request,NextFunction ,Response} from "express"
// import { BadRequestExption } from "../Uitls/response/error.responsee"
// import { decodedToken } from "../Uitls/token/token";


// export const authentacation =()=>{
//     return async(req:Request,res:Response,next:NextFunction)=>{
//         if(!req.headers.authorization)
//             throw new BadRequestExption("missing authorization hader");

//         const {decoded,user}= await decodedToken({
            
//           authorization: req.headers.authorization,
//         });

//         req.user =user;
//         req.decoded= decoded;
//         next();

//     }
// 