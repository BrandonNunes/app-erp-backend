import {
  IsEmail,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString, MaxLength,
  MinLength
} from 'class-validator';

export class CreateUsuarioDto {

  @IsNotEmpty({ message: 'O campo nome deve ser informado.' })
  nome: string;

  @IsNotEmpty({ message: 'Uma organização deve seve ser informada.' })
  @IsNumber({}, { message: 'Tipo de dado para a organização é inválido.' })
  id_organizacao: number;

  @IsEmail({}, { message: 'Formato de Email inválido.' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'O campo senha deve ser informado.' })
  @MinLength(6,  { message: 'Tamanho da senha deve ser no mínimo 6 caracteres.' })
  senha: string;

  @IsOptional()
  @IsString({ message: 'O campo origem deve ser do tipo texto.' })
  @IsNotEmpty({ message: 'Origem deve ser informada.' })
  origem: string;

  @IsNotEmpty({ message: 'O campo cpf deve ser informado.' })
  @MaxLength(11)
  cpf: string

  @IsNotEmpty()
  data_nascimento: Date

  @IsOptional()
  telefone: string

  @IsOptional()
  ativo: boolean

  @IsOptional()
  trocar_senha_prox_login: boolean

  @IsOptional()
  foto: string

  @IsOptional()
  super_usuario: boolean

  @IsOptional()
  admin: boolean

}
