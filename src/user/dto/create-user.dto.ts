import { IsNotEmpty, IsString, IsEmail, IsArray, IsOptional } from 'class-validator';
import { Cv } from 'src/cv/entities/cv.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  cvs: Cv[];
}