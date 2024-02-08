import {
    ArrayMinSize,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber, IsOptional,
    MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import {Column} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

enum TipoProcessoEnum {
    ACEITE_TRANSFERENCIA = "A",
    CANCELAR = "C",
    PROCESSAR = "P"
}
enum EntidadesExecutarEnum {
    'TABELAPRECO' = 'TABELAPRECO',
    'ENTRADA' = 'ENTRADA',
    'PEDIDO' = 'PEDIDO',
    'PEDIDOPOSITIVACAO' = 'PEDIDOPOSITIVACAO',
    'TRANSFERENCIA' = 'TRANSFERENCIA',
    'COMPRA' = 'COMPRA',
    'DEVOLUCAO' = 'DEVOLUCAO',
    'INTEGRACAOVENDA' = 'INTEGRACAOVENDA',
    'TRANSFERENCIAEMPRESA' = 'TRANSFERENCIAEMPRESA',
    'OUTRASAIDA' = 'OUTRASAIDA',
    'TRANSFACEITE' = 'TRANSFACEITE',
}
export class ListExecutarDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo sequencial deve ser informado.' })
    sequencial: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo entidade deve ser informado.' })
    @IsEnum(EntidadesExecutarEnum, {
        message: `Valor não permitido para o campo entidade, ${Object.values(EntidadesExecutarEnum).join(', ')}`
    })
    entidade: EntidadesExecutarEnum
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo tipo deve ser informado.' })
    @IsEnum(TipoProcessoEnum, {message: `Valor não permitido para o campo tipo, ${Object.values(TipoProcessoEnum).join(', ')}`})
    tipo: TipoProcessoEnum

}
export class ExecutarDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Uma empresa deve ser informada'})
    @IsNumber({}, {message: 'empresa deve ser um ID do tipo numero'})
    empresa: number;

    // @MinLength(1, {message: 'List não pode estar vazio', each: true})
    @ApiProperty({ isArray: true, type: ListExecutarDto})
    // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListExecutarDto)
    list: ListExecutarDto[]
    @ApiProperty()
    @ValidateIf(value => value.usuario === undefined)
    @IsNotEmpty({message: 'Um usuario deve ser informado'})
    usuario: string;
}
