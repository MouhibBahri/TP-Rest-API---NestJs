import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Skill } from 'src/skill/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  cin: number;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsOptional()
  skills: Skill[];

  @IsOptional()
  user: User;
}