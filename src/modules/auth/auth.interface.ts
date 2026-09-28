import { Gender, Role } from "../../generated/prisma/enums";


export interface IRegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  gender?: Gender;
  role: Role;
}

export interface Ilogin {
  email: string;
  password: string;
}

export interface IGoogleLogin {
  idToken: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  newPassword: string;
  otp: string;
}
