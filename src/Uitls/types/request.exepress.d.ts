import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
import { IUser } from "../../DB/Models/user.model"; // تأكد من المسار الصحيح

// نوسع نوع Request بتاع Express
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser & Document;  // المستخدم بعد فك التوكن
    decoded?: JwtPayload;     // البيانات اللي جوه التوكن (JWT payload)
     file?: Express.Multer.File;
  }
}

// import { JwtPayload } from 'jsonwebtoken';

// import { HUserDocument } from '../../DB/Models/user.model';



// declare module "express-serve-static-core"{
//     interface Request{
//         user?:HUserDocument;
//         decoded?:JwtPayload;
//     }
// }