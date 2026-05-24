import type { NextFunction,Request,Response } from "express";

export interface IError extends Error{
    statusCode:number;
}


export class ApplacationExeption extends Error{
    constructor(
        message:string,
        public statusCode:number,
        options?:ErrorOptions
    ){
        super(message,options);
        this.name =this.constructor.name;
    }
}
export class ForbiddenExption extends ApplacationExeption {
  constructor(
    message: string,
    options?: ErrorOptions
  ) {
    super(message, 403, options);
  }
}


export class BadRequestExption extends ApplacationExeption{
    constructor(
        message:string,options?:ErrorOptions )
        {
          super(message,400,options)
        }
}

export class NotFoundExption extends ApplacationExeption{
    constructor(
        message:string,options?:ErrorOptions )
        {
          super(message,400,options)
        }
}

export class ConflictUserExption extends ApplacationExeption{
    constructor(
        message:string,options?:ErrorOptions )
        {
          super(message,409,options)
        }
};

export class UnathraziedExption extends ApplacationExeption{
    constructor(
        message:string,options?:ErrorOptions )
        {
          super(message,401,options)
        }
}


export const glopalErrorhandeler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.MODE === "DEV" ? err.stack : undefined,
    cause: err.cause,
  });
};


// export const  glopalErrorhandeler =(
//     err:IError,
//     req:Request,
//      res:Response,
//       next:NextFunction,
//     )=>{
//     return res.status(500).json({
//        message: err.message||"something error",
//        stack: process.env.MODE === "DEV"? err.stack:undefined,
//        cause:err.cause,
//     });

