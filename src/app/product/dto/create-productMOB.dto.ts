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

export class ListCreateProductMobDto {
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
    @IsNotEmpty({ message: 'O campo tipo_item deve ser informado.' })
    tipo_item: number
    
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
    //@IsNotEmpty({ message: 'Um valor para Id deve ser informado.' })
    Id: number
    
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string
    @ApiProperty()
    @ValidateIf(value => value.codigoEAN === undefined)
    @IsNotEmpty({ message: 'O campo codigoEAN deve ser informado.' })
    codigoEAN: string
}

export class CreateProductMobDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Uma organização deve ser informada'})
    @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
    organizacao: number;

    // @MinLength(1, {message: 'List não pode estar vazio', each: true})
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListCreateProductMobDto})
    // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreateProductMobDto)
    list: ListCreateProductMobDto[]
    @ApiProperty()
    @ValidateIf(value => value.usuario === undefined)
    @IsNotEmpty({message: 'Um usuario deve ser informado'})
    usuario: string;
}
