import {
    IsEnum,
    IsNotEmpty,
    IsNumber, IsOptional,
    MaxLength, ValidateIf
} from 'class-validator';
import {Column} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

enum EnumTipoRegistro {
    PJ = 'PJ',
    PF = 'PF',
}
export class CreateLojaDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Uma organização deve ser informada.'})
    @IsNumber({}, {message: 'Tipo de dado informado não é válido.(organização)'})
    id_organizacao: number;

    @ApiProperty({enum: EnumTipoRegistro})
    @IsEnum(EnumTipoRegistro, {message: 'O campo Tipo de Registro deve ser um valor válido.'})
    tipo_registro: string;

    @ApiProperty()
    @ValidateIf((object, value) => object.tipo_registro === EnumTipoRegistro.PJ)
    @IsNotEmpty({message: 'Razão social deve ser informada.'})
    razao_social: string;

    @ApiProperty()
    @ValidateIf((object, value) => object.tipo_registro === EnumTipoRegistro.PJ)
    @IsNotEmpty({message: 'Nome fantasia deve ser informada.'})
    nome_fantasia: string;
    @ApiProperty()
    @IsNotEmpty({message: 'CPF/CNPJ deve ser informado.'})
    @MaxLength(14, { message: 'Campo CPF/CNPJ excede o tamanho maximo permitido.' })
    cpf_cnpj: string;
    @ApiProperty()
    @ValidateIf((object, value) => object.tipo_registro === EnumTipoRegistro.PF)
    @IsNotEmpty({message: 'Nome deve ser informado.'})
    nome: string;
    @ApiProperty()
    @IsNotEmpty({message: 'Telefone deve ser informado.'})
    @MaxLength(13, {message: 'Telefone excede o tamanho maximo.'})
    telefone1: string;
    @ApiProperty({required: false})
    @IsOptional()
    @MaxLength(13, {message: 'Telefone2 excede o tamanho maximo.'})
    telefone2: string;
    @ApiProperty({required: false})
    @IsOptional()
    ativo: boolean;
    @ApiProperty({required: false})
    @IsOptional()
    simples_nacional: boolean;
    @ApiProperty({required: false})
    @IsOptional()
    regime_normal: boolean;
    @ApiProperty({required: false})
    @IsOptional()
    sublimite_receita: boolean;
    @ApiProperty({required: false})
    @IsOptional()
    contribuinte_ipi: boolean;
    @ApiProperty()
    @IsNotEmpty({message: 'CEP deve ser informado.'})
    @MaxLength(8, { message: 'CEP excede o tamanho máximo.' })
    cep: string;
    @ApiProperty()
    @IsNotEmpty({message: 'Estado deve ser informado.'})
    estado: string;
    @ApiProperty()
    @IsNotEmpty({message: 'Cidade deve ser informado.'})
    cidade: string;
    @ApiProperty()
    @IsNotEmpty({message: 'Bairro deve ser informado.'})
    bairro: string;
    @ApiProperty()
    @IsNotEmpty({message: 'Rua deve ser informado.'})
    rua: string;
    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber({}, {message: 'tipo de dado ao campo Número é inválido.'})
    numero: string;
    @ApiProperty({required: false})
    @IsOptional()
    @MaxLength(100, {message: 'Limite máximo para o campo complemento excedido(100).'})
    complemento: string;
    @ApiProperty({required: false})
    @IsOptional()
    matrix: boolean;
    @ApiProperty({required: false})
    @IsOptional()
    id_matrix: string;
}
