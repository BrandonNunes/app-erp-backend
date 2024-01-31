import {

    IsNotEmpty,
    IsNumber, IsOptional, MaxLength,
} from 'class-validator';
import {Column, ForeignKey} from "sequelize-typescript";
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";
import {LojaModel} from "../../loja/entities/loja.entity";

export class CreateTipoProductDto {

    @IsNotEmpty({ message: 'Uma descrição deve ser informada.' })
    @MaxLength(50, { message: 'Tamanho máximo para a descrição(50) foi excedido.' })
    descricao: string;

    @IsNotEmpty({message: 'Uma organização válida deve ser informada.'})
    id_organizacao:  number;

    @IsOptional()
    id_loja: string;

    @IsOptional()
    ativo: boolean;

    @IsOptional()
    fixo: boolean

}
