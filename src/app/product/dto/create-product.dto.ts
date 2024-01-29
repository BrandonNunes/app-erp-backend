import {

    IsNotEmpty,
    IsNumber, IsOptional,
} from 'class-validator';
import {Column, ForeignKey} from "sequelize-typescript";
import {TipoProdutoModel} from "../entities/tipo_produto.entity";
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";
import {LojaModel} from "../../loja/entities/loja.entity";

export class CreateProductDto {

    @IsNotEmpty({ message: 'Um código de produto deve ser fornecido.' })
    codigo_produto: string;

    @IsNotEmpty({ message: 'Uma descrição válida deve ser fornecida.' })
    descricao: string;

    @IsNotEmpty({message: 'Tipo de produto deve ser fornecido.'})
    id_tipo_produto: string;

    @IsNotEmpty({message: 'Uma organização deve ser fornecida.'})
    id_organizacao:  number;

    @IsOptional()
    id_loja: string;

    @IsOptional()
    produto_padrao: boolean

    @IsOptional()
    ativo: boolean;

    @IsNotEmpty({ message: 'Um valor mínimo deve ser fornecida.' })
    @IsNumber()
    valor_minimo: number;

    @IsNotEmpty({ message: 'Um valor mínimo padrão ser fornecida.' })
    @IsNumber()
    valor_padrao: number;

    @IsNotEmpty({ message: 'Um valor máximo deve ser fornecida.' })
    @IsNumber()
    valor_maximo: number;

    @IsOptional()
    codigoEAN: string;

    @Column({defaultValue: null})
    foto: string;

}
