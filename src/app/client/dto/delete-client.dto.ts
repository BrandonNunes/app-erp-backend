import {
    IsNotEmpty,
    IsNumber, ValidateNested, ArrayMinSize, ValidateIf, IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class ListDeleteClientDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo sequencial deve ser informado.' })
    @IsString({message: 'Tipo de dado inválido para o campo sequencial, se espera o tipo string'})
    sequencial: string
}
export class DeleteClientDto {
    @ApiProperty()
    @IsNotEmpty({message: 'Uma organização deve ser informada'})
    @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
    empresa: number;

    // @MinLength(1, {message: 'List não pode estar vazio', each: true})
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListDeleteClientDto})
    // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListDeleteClientDto)
    list: ListDeleteClientDto[]

    @ValidateIf(value => value.usuario === undefined || value.usuario === "")
    @IsNotEmpty({message: 'Um valor válido deve ser passado para o campo usuario'})
    usuario: string | null

}