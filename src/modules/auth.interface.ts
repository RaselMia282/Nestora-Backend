import { Gender, Role } from "../generated/prisma/enums";

export interface IRegisterUser {
    name : string;
    email:string;
    password:string;
    firstName:string;
    lastName?:string;
    phone?:string;
    gender?:Gender
    role:Role

    
}