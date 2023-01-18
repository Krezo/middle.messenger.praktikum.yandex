import { Nullable } from './utils'

export enum UserRoles {
  ADMIN = 'admin',
}
export interface IUser {
  id: number
  first_name: string
  second_name: string
  display_name: string
  login: string
  email: string
  phone: string
  avatar: string
}

export interface IUserWithRole extends IUser {
  role: UserRoles
}

export interface IUserNullable extends Nullable<IUser> {}
