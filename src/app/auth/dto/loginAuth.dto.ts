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
import {ListCreateClientDto} from "../../client/dto/create-client.dto";

export class ListLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo usuario deve ser informado.' })
  usuario: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo senha deve ser informado.' })
  senha: string
}
export class LoginAuthDto {
  @ApiProperty()
  @IsNotEmpty({message: 'Organização deve ser informada.'})
  organizacao: number

  @ApiProperty({ isArray: true, type: ListLoginDto})
  // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
  @Type(() => ListLoginDto)
  list: ListLoginDto[]
}

