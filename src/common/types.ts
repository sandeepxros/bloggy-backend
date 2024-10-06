import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

export class JwtPayload {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsString()
  name: string;
}
