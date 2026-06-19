import { UserModel } from './../../DB/Models/user.model';
import { JwtPayload, verify, Secret, sign, SignOptions } from "jsonwebtoken";
import { HUserDocument, RoleEnum } from "../../DB/Models/user.model";
import { UnathraziedExption } from "../response/error.responsee";
import { UserRepository } from '../../DB/repositories/user.repository';

export enum SignatureLevelEnum {
    STUDENT = "STUDENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
}

export enum TokenEnum {
    ACCESS = "ACCESS",
    REFRESH = "REFRESH",
}

//  إنشاء توكن
export const generateToken = async ({
    payload,
    secret = process.env.ACCESS_STUDENT_SIGNATURE as string,
    options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
}: {
    payload: object;
    secret?: Secret;
    options?: SignOptions;
}): Promise<string> => {
    return await sign(payload, secret, options);
};

//  التحقق من التوكن
export const verifyToken = async ({
    token,
    secret = process.env.ACCESS_STUDENT_SIGNATURE as string,
}: {
    token: string;
    secret?: Secret;
}): Promise<JwtPayload> => {
    return (await verify(token, secret)) as JwtPayload;
};

// تحديد مستوى التوقيع حسب الدور
export const getSignatureLevel = async (role: RoleEnum): Promise<SignatureLevelEnum> => {
    switch (role) {
        case RoleEnum.ADMIN:
            return SignatureLevelEnum.ADMIN;
        case RoleEnum.DOCTOR:
            return SignatureLevelEnum.DOCTOR;
        case RoleEnum.STUDENT:
        default:
            return SignatureLevelEnum.STUDENT;
    }
};

// جلب المفاتيح المناسبة حسب الدور
export const getSignature = async (signatureLevel: SignatureLevelEnum): Promise<{
    access_signature: string,
    refresh_signature: string,
}> => {
    let signatures = {
        access_signature: "",
        refresh_signature: "",
    };

    switch (signatureLevel) {
        case SignatureLevelEnum.ADMIN:
            signatures.access_signature = process.env.ACCESS_ADMIN_SIGNATURE as string;
            signatures.refresh_signature = process.env.REFRESH_ADMIN_SIGNATURE as string;
            break;
        case SignatureLevelEnum.DOCTOR:
            signatures.access_signature = process.env.ACCESS_DOCTOR_SIGNATURE as string;
            signatures.refresh_signature = process.env.REFRESH_DOCTOR_SIGNATURE as string;
            break;
        case SignatureLevelEnum.STUDENT:
        default:
            signatures.access_signature = process.env.ACCESS_STUDENT_SIGNATURE as string;
            signatures.refresh_signature = process.env.REFRESH_STUDENT_SIGNATURE as string;
            break;
    }
    return signatures;
};

//  إنشاء بيانات تسجيل الدخول (Tokens)
export const createLoginCredentials = async (user: HUserDocument) => {
    const signatureLevel = await getSignatureLevel(user.role);
    const signatures = await getSignature(signatureLevel);

    //  التحميل الصحيح  UserID الجامعي وليس Mongo ID
    const tokenPayload = {
        _id: user._id,
        userId: user.UserID, // ✅ الحقل الصحيح الآن
        email: user.email,
        username: user.username,
        role: user.role,
        major: user.major,
        level: user.level,
        department: user.department
    };

    //  إنشاء Access Token
    const accessToken = await generateToken({
        payload: tokenPayload,
        secret: signatures.access_signature,
        options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) }
    });

    //  إنشاء Refresh Token
    const refreshToken = await generateToken({
        payload: {
            _id: user._id,
            userId: user.UserID, // ✅ نفس التعديل هنا
            type: 'refresh'
        },
        secret: signatures.refresh_signature,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
    });

    return {
        accessToken,
        refreshToken,
        user: tokenPayload,
        tokenType: 'Bearer',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    };
};

// فك التوكن والتحقق من الصلاحية
export const decodedToken = async ({
    authorization,
    tokenType = TokenEnum.ACCESS,
}: {
    authorization: string;
    tokenType?: TokenEnum;
}) => {
    const userModel = new UserRepository(UserModel);

    if (!authorization) {
        throw new UnathraziedExption("Authorization header is required");
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer !== 'Bearer' || !token) {
        throw new UnathraziedExption("Invalid token format. Use: Bearer <token>");
    }

    try {
        let decoded: JwtPayload | null = null;
        let userRole: SignatureLevelEnum | null = null;

        const possibleSignatures = [
            SignatureLevelEnum.ADMIN,
            SignatureLevelEnum.DOCTOR,
            SignatureLevelEnum.STUDENT
        ];

        // تجربة جميع المفاتيح المحتملة
        for (const role of possibleSignatures) {
            try {
                const signatures = await getSignature(role);
                const secret = tokenType === TokenEnum.REFRESH
                    ? signatures.refresh_signature
                    : signatures.access_signature;

                decoded = await verifyToken({ token, secret });
                if (decoded) {
                    userRole = role;
                    break;
                }
            } catch {
                continue;
            }
        }

        if (!decoded || !userRole) {
            throw new UnathraziedExption("Invalid or expired token");
        }

        if (!decoded._id || !decoded.userId) {
            throw new UnathraziedExption("Invalid token payload - missing fields");
        }

        //  البحث عن المستخدم بالـ UserID الصحيح
        const user = await userModel.findOne({
            filter: { UserID: decoded.userId },
        });

        if (!user) {
            throw new UnathraziedExption("Account not found with this university ID");
        }

        //  تحقق إضافي من الـ _id
        if (user._id.toString() !== decoded._id) {
            throw new UnathraziedExption("Token user ID mismatch");
        }

        //  تحقق من تطابق الدور
        const userSignatureLevel = await getSignatureLevel(user.role);
        console.log("========== TOKEN DEBUG ==========");
console.log("decoded.role =", decoded.role);
console.log("userRole (from signature) =", userRole);
console.log("db.role =", user.role);
console.log("dbSignatureLevel =", userSignatureLevel);
console.log("ACCESS_DOCTOR_SIGNATURE =", process.env.ACCESS_DOCTOR_SIGNATURE?.length);
console.log("ACCESS_STUDENT_SIGNATURE =", process.env.ACCESS_STUDENT_SIGNATURE?.length);
console.log("ACCESS_ADMIN_SIGNATURE =", process.env.ACCESS_ADMIN_SIGNATURE?.length);
        if (userSignatureLevel !== userRole) {
            throw new UnathraziedExption("Role mismatch - invalid token for this user");
        }

        return {
            ...decoded,
            userRole,
            userData: user
        };
    } catch (error) {
        if (error instanceof UnathraziedExption) throw error;
        throw new UnathraziedExption("Invalid token");
    }
};

//  التحقق من الصلاحيات
export const checkPermission = (userRole: RoleEnum, requiredRoles: RoleEnum[]): boolean => {
    return requiredRoles.includes(userRole);
};

//  middleware للتحقق من الصلاحيات
export const authenticateToken = (requiredRoles?: RoleEnum[]) => {
    return async (req: any, res: any, next: any) => {
        try {
            const authHeader = req.headers['authorization'];
            const decoded = await decodedToken({ authorization: authHeader });

            if (requiredRoles && requiredRoles.length > 0) {
                if (!checkPermission(decoded.userData.role, requiredRoles)) {
                    throw new UnathraziedExption("Insufficient permissions");
                }
            }

            req.user = decoded;
            next();
        } catch (error) {
            next(error);
        }
    };
};

// دوال مساعدة للأدوار
export const isStudent = (user: any): boolean => user?.userData?.role === RoleEnum.STUDENT;
export const isDoctor = (user: any): boolean => user?.userData?.role === RoleEnum.DOCTOR;
export const isAdmin = (user: any): boolean => user?.userData?.role === RoleEnum.ADMIN;


// import { UserModel } from './../../DB/Models/user.model';
// import { JwtPayload, verify, Secret, sign, SignOptions } from "jsonwebtoken";
// import { HUserDocument, RoleEnum } from "../../DB/Models/user.model";
// import { UnathraziedExption } from "../response/error.responsee";
// import { UserRepository } from '../../DB/repositories/user.repository';

// export enum SignatureLevelEnum {
//     STUDENT = "STUDENT",
//     DOCTOR = "DOCTOR",
//     ADMIN = "ADMIN",
// }

// export enum TokenEnum {
//     ACCESS = "ACCESS",
//     REFRESH = "REFRESH",
// }

// export const generateToken = async ({
//     payload,
//     secret = process.env.ACCESS_STUDENT_SIGNATURE as string,
//     options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
// }: {
//     payload: object;
//     secret?: Secret;
//     options?: SignOptions;
// }): Promise<string> => {
//     return await sign(payload, secret, options);
// };

// export const verifyToken = async ({
//     token,
//     secret = process.env.ACCESS_STUDENT_SIGNATURE as string,
// }: {
//     token: string;
//     secret?: Secret;
// }): Promise<JwtPayload> => {
//     return (await verify(token, secret)) as JwtPayload;
// };

// export const getSignatureLevel = async (role: RoleEnum): Promise<SignatureLevelEnum> => {
//     switch (role) {
//         case RoleEnum.ADMIN:
//             return SignatureLevelEnum.ADMIN;
//         case RoleEnum.DOCTOR:
//             return SignatureLevelEnum.DOCTOR;
//         case RoleEnum.STUDENT:
//         default:
//             return SignatureLevelEnum.STUDENT;
//     }
// }

// export const getSignature = async (signatureLevel: SignatureLevelEnum): Promise<{
//     access_signature: string,
//     refresh_signature: string,
// }> => {
//     let signatures = {
//         access_signature: "",
//         refresh_signature: "",
//     };

//     switch (signatureLevel) {
//         case SignatureLevelEnum.ADMIN:
//             signatures.access_signature = process.env.ACCESS_ADMIN_SIGNATURE as string;
//             signatures.refresh_signature = process.env.REFRESH_ADMIN_SIGNATURE as string;
//             break;
//         case SignatureLevelEnum.DOCTOR:
//             signatures.access_signature = process.env.ACCESS_DOCTOR_SIGNATURE as string;
//             signatures.refresh_signature = process.env.REFRESH_DOCTOR_SIGNATURE as string;
//             break;
//         case SignatureLevelEnum.STUDENT:
//         default:
//             signatures.access_signature = process.env.ACCESS_STUDENT_SIGNATURE as string;
//             signatures.refresh_signature = process.env.REFRESH_STUDENT_SIGNATURE as string;
//             break;
//     }
//     return signatures;
// };

// export const createLoginCredentials = async (user: HUserDocument) => {
//     const signatureLevel = await getSignatureLevel(user.role);
//     const signatures = await getSignature(signatureLevel);

//     // تحضير بيانات التوكن مع الـ ID الجامعي
//     const tokenPayload = {
//         _id: user._id,
//         userId: user.id, // الـ ID الجامعي الثابت
//         email: user.email,
//         username: user.username,
//         role: user.role,
//         major: user.major,
//         level: user.level,
//         department: user.department
//     };

//     const accessToken = await generateToken({
//         payload: tokenPayload,
//         secret: signatures.access_signature,
//         options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) }
//     });

//     const refreshToken = await generateToken({
//         payload: { 
//             _id: user._id,
//             userId: user.id, // إضافة الـ ID الجامعي في الـ refresh token أيضًا
//             type: 'refresh'
//         },
//         secret: signatures.refresh_signature,
//         options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
//     });

//     return {
//         accessToken,
//         refreshToken,
//         user: tokenPayload,
//         tokenType: 'Bearer',
//         expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
//     };
// };

// export const decodedToken = async ({
//     authorization,
//     tokenType = TokenEnum.ACCESS,
// }: {
//     authorization: string;
//     tokenType?: TokenEnum;
// }) => {
//     const userModel = new UserRepository(UserModel);
    
//     if (!authorization) {
//         throw new UnathraziedExption("Authorization header is required");
//     }
    
//     const [bearer, token] = authorization.split(" ");
    
//     if (bearer !== 'Bearer' || !token) {
//         throw new UnathraziedExption("Invalid token format. Use: Bearer <token>");
//     }

//     try {
//         let decoded: JwtPayload | null = null;
//         let userRole: SignatureLevelEnum | null = null;

//         // قائمة بالأدوار الممكنة
//         const possibleSignatures = [
//             SignatureLevelEnum.ADMIN,
//             SignatureLevelEnum.DOCTOR,
//             SignatureLevelEnum.STUDENT
//         ];

//         // تجربة جميع التوقيعات الممكنة
//         for (const role of possibleSignatures) {
//             try {
//                 const signatures = await getSignature(role);
//                 const secret = tokenType === TokenEnum.REFRESH ? 
//                     signatures.refresh_signature : 
//                     signatures.access_signature;
                
//                 decoded = await verifyToken({ token, secret });
//                 if (decoded) {
//                     userRole = role;
//                     break;
//                 }
//             } catch (error) {
//                 // الاستمرار في المحاولة مع التوقيع التالي
//                 continue;
//             }
//         }

//         if (!decoded || !userRole) {
//             throw new UnathraziedExption("Invalid or expired token");
//         }

//         // التحقق من وجود البيانات الأساسية في التوكن
//         if (!decoded._id || !decoded.iat || !decoded.userId) {
//             throw new UnathraziedExption("Invalid token payload - missing required fields");
//         }

//         // البحث عن المستخدم باستخدام الـ ID الجامعي الثابت فقط
//         const user = await userModel.findOne({
//             filter: { 
//                 id: decoded.userId // البحث بالمعرّف الجامعي الثابت
//             },
//         });

//         if (!user) {
//             throw new UnathraziedExption("Account not found with this university ID");
//         }

//         // تحقق إضافي: أن الـ _id في التوكن يطابق الـ _id في قاعدة البيانات
//         if (user._id.toString() !== decoded._id) {
//             throw new UnathraziedExption("Token user ID mismatch");
//         }

//         // التحقق من تطابق الدور
//         const userSignatureLevel = await getSignatureLevel(user.role);
//         if (userSignatureLevel !== userRole) {
//             throw new UnathraziedExption("Role mismatch - invalid token for this user");
//         }

//         return {
//             ...decoded,
//             userRole,
//             userData: user
//         };

//     } catch (error) {
//         if (error instanceof UnathraziedExption) {
//             throw error;
//         }
//         throw new UnathraziedExption("Invalid token");
//     }
// };

// // دالة للتحقق من الصلاحيات
// export const checkPermission = (userRole: RoleEnum, requiredRoles: RoleEnum[]): boolean => {
//     return requiredRoles.includes(userRole);
// };

// // middleware للتحقق من التوكن
// export const authenticateToken = (requiredRoles?: RoleEnum[]) => {
//     return async (req: any, res: any, next: any) => {
//         try {
//             const authHeader = req.headers['authorization'];
//             const decoded = await decodedToken({ authorization: authHeader });

//             // التحقق من الصلاحيات إذا طُلبت
//             if (requiredRoles && requiredRoles.length > 0) {
//                 if (!checkPermission(decoded.userData.role, requiredRoles)) {
//                     throw new UnathraziedExption("Insufficient permissions");
//                 }
//             }

//             req.user = decoded;
//             next();
//         } catch (error) {
//             next(error);
//         }
//     };
// };

// // دوال مساعدة للتحقق من الأدوار
// export const isStudent = (user: any): boolean => {
//     return user?.userData?.role === RoleEnum.STUDENT;
// };

// export const isDoctor = (user: any): boolean => {
//     return user?.userData?.role === RoleEnum.DOCTOR;
// };

// export const isAdmin = (user: any): boolean => {
//     return user?.userData?.role === RoleEnum.ADMIN;
// };

