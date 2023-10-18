import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
    MinLength
} from 'class-validator';

export class CreateUsuarioDto {

  @IsNotEmpty({ message: 'O campo nome deve ser informado.' })
  nome: string;

  @IsEmail({}, { message: 'Formato de Email inválido.' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'O campo cpf/cnpj deve ser informado.' })
  cpf_cnpj: string;

  @IsNotEmpty({ message: 'O campo senha deve ser informado.' })
  @MinLength(6,  { message: 'Tamanho da senha deve ser no mínimo 6 caracteres.' })
  senha: string;

  @IsString({ message: 'O campo origem deve ser do tipo texto.' })
  @IsNotEmpty({ message: 'Origem deve ser informada.' })
  origem: string;

  @IsNotEmpty({ message: 'Uma organização deve seve ser informada.' })
  @IsNumber({}, { message: 'Tipo de dado para a organização é inválido.' })
  id_organizacao: number;

}
