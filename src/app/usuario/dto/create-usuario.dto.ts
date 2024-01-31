import {
  IsEmail,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString, MaxLength,
  MinLength,
  IsDate, IsArray, ValidateNested, ArrayMinSize, ValidateIf, isISO8601
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListCreateUserDto {
  @IsNotEmpty({ message: 'O campo id deve ser informado.' })
  id: number
  @IsNotEmpty({ message: 'O campo usuario deve ser informado.' })
  usuario: string
  @IsNotEmpty({ message: 'O campo email deve ser informado.' })
  @IsEmail({}, {message: 'Formato de Email inválido'})
  email: string;
  @IsNotEmpty({ message: 'O campo cpf_cnpj deve ser informado.' })
  cpf_cnpj: string
  @ValidateIf(value => value.rg_ie === undefined)
  @IsNotEmpty({message: 'Um valor deve ser informado para o campo rg_ie'})
  rg_ie: string | null
  @ValidateIf(value => value.orgao_expeditor === undefined)
  @IsNotEmpty({ message: 'Um valor para orgao_expeditor deve ser informado.' })
  orgao_expeditor: number| null
  @IsNotEmpty({ message: 'O campo data_nascimento deve ser informado.' })
  // @IsDate({message: 'Formato de data inválido para o campo data_nascimento', },)
  data_nascimento: string;
  @IsNotEmpty({ message: 'O campo cep deve ser informado.' })
  cep: string
  @IsNotEmpty({ message: 'O campo tipo_logradouro deve ser informado.' })
  tipo_logradouro: string
  @IsNotEmpty({ message: 'O campo endereco deve ser informado.' })
  endereco: string
  @IsNotEmpty({ message: 'O campo logradouro deve ser informado.' })
  logradouro: string
  @ValidateIf(value => value.complemento === undefined)
  @IsNotEmpty({ message: 'O campo complemento deve ser informado.' })
  complemento: string
  @IsNotEmpty({ message: 'O campo bairro deve ser informado.' })
  bairro: number
  @IsNotEmpty({ message: 'O campo cidade deve ser informado.' })
  cidade: number
  @IsNotEmpty({ message: 'O campo uf deve ser informado.' })
  uf: string
  @IsNotEmpty({ message: 'O campo tema deve ser informado.' })
  tema: number
  @IsNotEmpty({ message: 'O campo ativo deve ser informado.' })
  ativo: boolean
  @ValidateIf(value => value.grupos === undefined)
  @IsNotEmpty({ message: 'O campo grupos deve ser informado.' })
  grupos: string
  @IsNotEmpty({ message: 'O campo fone_ddd deve ser informado.' })
  fone_ddd: string;
  @IsNotEmpty({ message: 'O campo telefone deve ser informado.' })
  telefone: string
  @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
  CodigoExterno: string
}
export class CreateUsuarioDto {
  @IsNotEmpty({message: 'Uma organização deve ser informada'})
  @IsNumber({}, {message: 'Organização deve ser um ID do tipo numero'})
  organizacao: number;

 // @MinLength(1, {message: 'List não pode estar vazio', each: true})
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ListCreateUserDto)
  list: ListCreateUserDto[]

}
