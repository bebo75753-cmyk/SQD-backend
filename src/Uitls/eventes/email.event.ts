
import Mail from "nodemailer/lib/mailer";
import { EventEmitter } from "node:events";
import { template } from '../email/send.email.tempaled';
import { sendEmail } from "../email/send.email";
export const emailevent = new EventEmitter()
interface IEmail extends Mail.Options{
    otp:number;
    username:string,
}
emailevent.on("confirmEmail", async (data:IEmail) => {
    try {
        data.subject ="confirm your email";
        data.html=template(data.otp,data.username,data.subject,)
        await sendEmail(data);
    } catch (error) {
      console.log("filed to send email",error);
      
    }

})