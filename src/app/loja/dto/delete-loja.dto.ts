import {
  IsEmail,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString, MaxLength,
  MinLength,
  IsDate, IsArray, ValidateNested, ArrayMinSize, ValidateIf, isISO8601
} from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty, getSchemaPath} from "@nestjs/swagger";
import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export class ListDeleteStoreDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo sequencial deve ser informado.' })
  sequencial: string
}
export class DeleteStoreDto {
  @ApiProperty()
  @IsNotEmpty({message: 'Uma organização deve ser informada'})
  @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
  organizacao: number;

 // @MinLength(1, {message: 'List não pode estar vazio', each: true})
  @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListDeleteStoreDto})
 // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
 @Type(() => ListDeleteStoreDto)
  list: ListDeleteStoreDto[]
  @ApiProperty()
  @ValidateIf(value => value.usuario === undefined)
  @IsNotEmpty({message: 'Um usuario deve ser informado'})
  usuario: string;

}
