import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateCompanyDto {

  @IsNotEmpty({message: 'Empresa precisa está vinculada a uma organização válida.'})
  idOrganizacao: number;

  @IsNotEmpty({message: 'Razão social deve ser fornecido.'})
  razao_social: string;

  @IsNotEmpty({message: 'Um CPF/CNPJ deve ser fornecido.'})
  cnpj_cpf: string;

  // @Column
  // email: string;
  @IsNotEmpty({message: 'Nome fantasia deve ser fornecido.'})
  nome_fantasia: string;

  @IsNotEmpty({message: 'A identificação de uma cidade deve ser fornecida.'})
  cidade: number;

  @IsNotEmpty({message: 'A identificação de um bairro deve ser fornecida.'})
  bairro: number

}
