import {
  ArrayMinSize,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength, ValidateIf,
  ValidateNested
} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class ListCreateClientDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo cliente deve ser informado.' })
  cliente: number
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo nome deve ser informado.' })
  nome: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo razao_social deve ser informado.' })
  razao_social: string;
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
  @IsNotEmpty({ message: 'O campo segmento deve ser informado.' })
  segmento: number;
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
  @IsNotEmpty({ message: 'O campo fone_ddd1 deve ser informado.' })
  fone_ddd1: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo telefone1 deve ser informado.' })
  telefone1: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo situacao deve ser informado.' })
  situacao: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo uf deve ser informado.' })
  uf: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo datacadastro deve ser informado.' })
  datacadastro: string
  @ApiProperty()
  @ValidateIf(value => value.grupos === undefined)
  @IsNotEmpty({ message: 'O campo email deve ser informado.' })
  @IsEmail(null, {message: 'Formato de email inválido.'})
  email: string
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
  CodigoExterno: string

}
export class CreateClientDto {

  @ApiProperty()
  @IsNotEmpty({message: 'Uma empresa deve ser informada'})
  @IsNumber({}, {message: 'Empresa deve ser um ID do tipo numero'})
  empresa: number;

  // @MinLength(1, {message: 'List não pode estar vazio', each: true})
  @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListCreateClientDto})
  // @IsArray({each: true, message: 'O atributo list deve ser do tipo Array'})
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
  @Type(() => ListCreateClientDto)
  list: ListCreateClientDto[]
  @ApiProperty()
  @ValidateIf(value => value.usuario === undefined)
  @IsNotEmpty({message: 'Um usuario deve ser informado'})
  usuario: string;

}
