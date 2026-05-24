import { hash,compare } from "bcrypt";


export const genrateHash = async(plantext:string,soltRound:number=Number(process.env.SALT as string)):Promise<string>=>{

return await hash(plantext,soltRound);

}

export const compareHash = async(plantext:string,hash:string):Promise<boolean>=>{

return await compare(plantext,hash);

}