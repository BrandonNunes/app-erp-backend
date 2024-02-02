import {
  IsEmail,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString, MaxLength,
  MinLength,
  IsDate, IsArray, ValidateNested, ArrayMinSize, ValidateIf, isISO8601
} from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class LoginAuthDto {
  @ApiProperty()
  @IsOptional()
  organizacao: number

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo usuario deve ser informado.' })
  login: string

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo senha deve ser informado.' })
  senha: string;

}

