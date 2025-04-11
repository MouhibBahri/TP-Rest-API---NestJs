import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { Cv } from 'src/cv/entities/cv.entity';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsOptional()
  cvs: Cv[];
}