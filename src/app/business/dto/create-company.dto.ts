import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import {Column} from "sequelize-typescript";

export class CreateCompanyDto {

  @IsNotEmpty({message: 'Empresa deve está vinculada a uma organização válida.'})
  @IsNumber({}, {message: 'Tipo de dado para organização é inválido.'})
  id_organizacao: number;

  @IsNotEmpty({message: 'Razão social deve ser fornecido.'})
  razao_social: string;

  @IsNotEmpty({message: 'Um CPF/CNPJ deve ser fornecido.'})
  cpf_cnpj: string;

  @IsNotEmpty({message: 'Nome fantasia deve ser fornecido.'})
  @IsEmail({}, { message: 'Formato de E-mail inválido.' })
  email: string;
  // @IsNotEmpty({message: 'Nome fantasia deve ser fornecido.'})
  // nome_fantasia: string;
  //
  // @IsNotEmpty({message: 'A identificação de uma cidade deve ser fornecida.'})
  // cidade: number;
  //
  // @IsNotEmpty({message: 'A identificação de um bairro deve ser fornecida.'})
  // bairro: number

}
