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

export class ListCreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo id deve ser informado.' })
  id: number
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo usuario deve ser informado.' })
  usuario: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo email deve ser informado.' })
  @IsEmail({}, {message: 'Formato de Email inválido'})
  email: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo cpf_cnpj deve ser informado.' })
  cpf_cnpj: string
  @ApiProperty()
  @ValidateIf(value => value.rg_ie === undefined)
  @IsNotEmpty({message: 'Um valor deve ser informado para o campo rg_ie'})
  rg_ie: string | null
  @ApiProperty()
  @ValidateIf(value => value.orgao_expeditor === undefined)
  @IsNotEmpty({ message: 'Um valor para orgao_expeditor deve ser informado.' })
  orgao_expeditor: number| null
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo data_nascimento deve ser informado.' })
  // @IsDate({message: 'Formato de data inválido para o campo data_nascimento', },)
  data_nascimento: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo cep deve ser informado.' })
  cep: string
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
  @IsNotEmpty({ message: 'O campo bairro deve ser informado.' })
  bairro: number
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo cidade deve ser informado.' })
  cidade: number
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo uf deve ser informado.' })
  uf: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo tema deve ser informado.' })
  tema: number
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo ativo deve ser informado.' })
  ativo: boolean
  @ApiProperty()
  @ValidateIf(value => value.grupos === undefined)
  @IsNotEmpty({ message: 'O campo grupos deve ser informado.' })
  grupos: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo fone_ddd deve ser informado.' })
  fone_ddd: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo telefone deve ser informado.' })
  telefone: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
  CodigoExterno: string
}
export class CreateUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({message: 'Uma organização deve ser informada'})
  @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
  organizacao: number;

 // @MinLength(1, {message: 'List não pode estar vazio', each: true})
  @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListCreateUserDto})
 // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
 @Type(() => ListCreateUserDto)
  list: ListCreateUserDto[]

}
