import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterCvDto {
  @IsOptional()
  @IsString()
  criteria?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;
}
