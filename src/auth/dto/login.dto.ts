import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Username or Email of the user',
    example: 'mouhib',
  })
  usernameOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'Password of the user', example: 'password123!' })
  password: string;
}
