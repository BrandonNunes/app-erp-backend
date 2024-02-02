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

export class ListCreateStoreDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo id deve ser informado.' })
    razao_social: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo cpf_cnpj deve ser informado.' })
    cnpj_cpf: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo cep deve ser informado.' })
    cep: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo uf deve ser informado.' })
    uf: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo tipo_logradouro deve ser informado.' })
    tipo_logradouro: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo endereco deve ser informado.' })
    endereco: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo logradouro deve ser informado.' })
    logradouro: string
    @ApiProperty()
    @ValidateIf(value => value.complemento === undefined)
    @IsNotEmpty({ message: 'O campo complemento deve ser informado.' })
    complemento: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo cidade deve ser informado.' })
    cidade: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo bairro deve ser informado.' })
    bairro: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo contribuinte_ipi deve ser informado.' })
    contribuinte_ipi: number

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo id_regime_tributario deve ser informado.' })
    id_regime_tributario: number

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo fone_ddd1 deve ser informado.' })
    fone_ddd1: string

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo telefone1 deve ser informado.' })
    telefone1: string

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo situacao deve ser informado.' })
    situacao: string

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo empresa deve ser informado.' })
    empresa: number

    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo nome_fantasia deve ser informado.' })
    nome_fantasia: string
}
export class CreateLojaDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Uma organização deve ser informada'})
    @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
    organizacao: number;

    // @MinLength(1, {message: 'List não pode estar vazio', each: true})
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListCreateStoreDto})
    // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreateStoreDto)
    list: ListCreateStoreDto[]
    @ApiProperty()
    @ValidateIf(value => value.usuario === undefined)
    @IsNotEmpty({message: 'Um usuario deve ser informado'})
    usuario: string;
}
