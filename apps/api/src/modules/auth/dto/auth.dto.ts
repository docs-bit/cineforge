import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  password!: string;
}

export class LoginDto extends RegisterDto {}

export class RefreshDto {
  @IsString()
  @MinLength(20)
  refresh_token!: string;
}

export class LogoutDto {
  @IsString()
  @MinLength(20)
  access_token!: string;
}
