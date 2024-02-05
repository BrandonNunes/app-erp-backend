import {
  IsNotEmpty,
  IsNumber, ValidateNested, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class ListDeleteUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo sequencial deve ser informado.' })
  sequencial: string
}
export class DeleteUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({message: 'Uma organização deve ser informada'})
  @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
  organizacao: number;

 // @MinLength(1, {message: 'List não pode estar vazio', each: true})
  @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListDeleteUserDto})
 // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
 @Type(() => ListDeleteUserDto)
  list: ListDeleteUserDto[]

}
