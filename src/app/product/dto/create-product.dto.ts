import {
    ArrayMinSize, IsBoolean,
    IsNotEmpty,
    IsNumber, IsOptional, ValidateIf, ValidateNested,
} from 'class-validator';
import {Column, ForeignKey} from "sequelize-typescript";
import {TipoProdutoModel} from "../entities/tipo_produto.entity";
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";
import {LojaModel} from "../../loja/entities/loja.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class ListCreateProductDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo empresa deve ser informado.' })
    empresa: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo produto deve ser informado.' })
    produto: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo descricao deve ser informado.' })
    descricao: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo medida_base deve ser informado.' })
    medida_base: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo tipo_item deve ser informado.' })
    tipo_item: number
    @ApiProperty()
    @IsNotEmpty({message: 'Um valor deve ser informado para o campo situacao'})
    situacao: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para venda_padrao deve ser informado.' })
    venda_padrao: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para venda_minima deve ser informado.' })
    venda_minima: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para venda_maxima deve ser informado.' })
    venda_maxima: number
    @ApiProperty()
    @IsOptional()
    @IsBoolean({message: 'obrigar_rastreamento deve ser do tipo bool'})
    obrigar_rastreamento: boolean
    @ApiProperty()
    @IsNotEmpty({message: 'tamanho_numero_serie deve ser informado'})
    tamanho_numero_serie: number
    @ApiProperty()
    @IsBoolean({message: 'eh_recarga deve ser do tipo bool'})
    eh_recarga: boolean
    @ApiProperty()
    @IsBoolean({message: 'eh_sem_estoque deve ser do tipo bool'})
    eh_sem_estoque: boolean
    @ApiProperty()
    @IsBoolean({message: 'eh_sem_estoque deve ser do tipo bool'})
    eh_assinatura: boolean
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para marca deve ser informado.' })
    marca: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para grupo deve ser informado.' })
    grupo: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para Id deve ser informado.' })
    Id: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para venda_varejo deve ser informado.' })
    venda_varejo: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para venda_atacado deve ser informado.' })
    venda_atacado: number
    @ApiProperty()
    @ValidateIf(value => value.codigoSAP === undefined)
    @IsNotEmpty({ message: 'O campo codigoSAP deve ser informado.' })
    codigoSAP: string;
    @ApiProperty()
    @ValidateIf(value => value.descricaoSAP === undefined)
    @IsNotEmpty({ message: 'O campo descricaoSAP deve ser informado.' })
    descricaoSAP: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string
    @ApiProperty()
    @ValidateIf(value => value.codigoEAN === undefined)
    @IsNotEmpty({ message: 'O campo codigoEAN deve ser informado.' })
    codigoEAN: string
    @ApiProperty()
    @IsBoolean({message: 'eh_alfanumerico deve ser do tipo bool'})
    eh_alfanumerico: boolean
    @ApiProperty()
    @ValidateIf(value => value.validade === undefined)
    @IsNotEmpty({ message: 'Um valor para validade deve ser informado.' })
    validade: number
    @ApiProperty()
    @IsBoolean({message: 'nao_movimenta_financeiro deve ser do tipo bool'})
    nao_movimenta_financeiro: boolean
}

export class CreateProductDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Uma organização deve ser informada'})
    @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
    organizacao: number;

    // @MinLength(1, {message: 'List não pode estar vazio', each: true})
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListCreateProductDto})
    // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreateProductDto)
    list: ListCreateProductDto[]
    @ApiProperty()
    @ValidateIf(value => value.usuario === undefined)
    @IsNotEmpty({message: 'Um usuario deve ser informado'})
    usuario: string;
}
