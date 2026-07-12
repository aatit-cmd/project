export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}


export const All_Admin = [Role.ADMIN, Role.SUPER_ADMIN];
export const User_Only = [Role.USER];