import { Request, Response } from "express";
import {
  BadRequestExption,
  ConflictUserExption,
  NotFoundExption,
} from "../../Uitls/response/error.responsee";
import { UserModel, RoleEnum } from "../../DB/Models/user.model";
import { UserRepository } from "../../DB/repositories/user.repository";
import { compareHash, genrateHash } from "../../Uitls/security/hashing";
import { generateOTP } from "../../Uitls/generateOTP";
import { ISignupDot } from "./auth.dto";
import { createLoginCredentials } from "../../Uitls/token/token";
import { emailevent } from "../../Uitls/eventes/email.event";
import { AIService } from "../../service/ai.service";

class AuthenticationService {
  private _userModel = new UserRepository(UserModel);
  /**
   * 🟢 Signup (Student / Doctor)
   */
  signup = async (req: Request, res: Response): Promise<Response> => {
    const {
      UserID,
      username,
      email,
      password,
      phone,
      address,
      major,
      level,
      department,
    }: ISignupDot = req.body;

    const chekUser = await this._userModel.findOne({
      filter: { email },
      select: "email",
      options: { lean: true },
    });
    if (chekUser) throw new ConflictUserExption("User already exists");
    console.log(chekUser);

    // تحديد الدور حسب ID
    //  تحديد الدور حسب أول 3 حروف في الـ UserID
let role: RoleEnum;

if (UserID.startsWith("STU")) {
  role = RoleEnum.STUDENT;
} else if (UserID.startsWith("DOC")) {
  role = RoleEnum.DOCTOR;
} else if (UserID.startsWith("ADM")) {
  role = RoleEnum.ADMIN;
} else {
  throw new BadRequestExption(
    "Invalid UserID format. Must start with STU (Student), DOC (Doctor), or ADM (Admin)"
  );
}

//  منع تسجيل الأدمن
if (role === RoleEnum.ADMIN)
  throw new BadRequestExption("Admin registration not allowed");

// تحقق من حقول الطالب
if (role === RoleEnum.STUDENT && (!major || !level))
  throw new BadRequestExption("Student must include major and level");

//  تحقق من حقول الدكتور
if (role === RoleEnum.DOCTOR && !department)
  throw new BadRequestExption("Doctor must include department");

    const otp = generateOTP();
    // const hashedPassword = await genrateHash(password);
    // const hashedOTP = await genrateHash(String(otp));

    const user = await this._userModel.createUser({
      data: [
        {
          UserID,
          username,
          email,
          password: await genrateHash(password),
          confirmEmailOTP: await genrateHash(String(otp)),

          role,
          phone: phone || "",
          address: address || "",
          major: role === RoleEnum.STUDENT ? major : undefined,
          level: role === RoleEnum.STUDENT ? level : undefined,
          department: role === RoleEnum.DOCTOR ? department : undefined,
        },
      ],
      options: { validateBeforeSave: true },
    });
  await AIService.registerUser(UserID);
    // const createdUser = await UserModel.create(userData as IUser);

    emailevent.emit("confirmEmail", { to: email, username, otp });

    return res.status(201).json({ message: "User crated successfly", user });
  };
  // return res.status(201).json({

  //   message: "User created successfully. Please confirm your email.",
  //   user: createdUser,
  // });

  /**
   *  Login
   */
login = async (req: Request, res: Response): Promise<Response> => {
  const { email, UserID, password } = req.body;

  //  نبحث باستخدام فلترة دقيقة
  const user = await this._userModel.findOne({
    filter: {
      $or: [
        { email: email?.toLowerCase().trim() },
        { UserID: UserID?.toUpperCase().trim() }  //  الحقل الصحيح
      ]
    },



  });

    if (!user) throw new NotFoundExption("invaled account ");
    if (!compareHash(password, user?.password))
      throw new BadRequestExption("invalid password");
  //  تحديد الدور تلقائي من الـ ID
if (user.UserID.startsWith("STU")) user.role = RoleEnum.STUDENT;
else if (user.UserID.startsWith("DOC")) user.role = RoleEnum.DOCTOR;
else if (user.UserID.startsWith("ADM")) user.role = RoleEnum.ADMIN;
  // const credentials = await createLoginCredentials(user);

// if (!user) throw new NotFoundExption("invaled account ");
//     if (!compareHash(password, user?.password))
//       throw new BadRequestExption("invalid password");

    const credentails = await createLoginCredentials(user);
    return res
      .status(200)
      .json({ message: "User login  successfly", credentails });



  // return res.status(200).json({
  //   message: "User login successfully",
  //   credentials,
  // });
};
confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp } = req.body;
    const user = await this._userModel.findOne({
      filter: {
        email,
        confirmEmailOTP: { $exists: true }, //
        confirmedAt: { $exists: false },
      },
    });

    if (!user) throw new NotFoundExption("Invalid Account");

    if (!user?.confirmEmailOTP)
      throw new BadRequestExption("No OTP found for this user");

    if (!compareHash(otp, user.confirmEmailOTP))
      throw new BadRequestExption("Invalid OTP");

    // //update user update one
    await this._userModel.updateOne({
      filter: { email },
      update: {
        confirmedAt: Date.now(),
        $unset: { confirmEmailOTP: true },
      },
    });

    return res.status(200).json({ message: "User confirm  successfly" });
  };
};


export default new AuthenticationService();
