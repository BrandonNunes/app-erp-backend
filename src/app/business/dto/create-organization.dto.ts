import {
  IsNotEmpty,
} from 'class-validator';
import {Column} from "sequelize-typescript";

export class CreateOrganizationDto {

  @IsNotEmpty({message: 'Um contrato deve ser informado.'})
  id_contrato: number;

  @IsNotEmpty({message: 'Uma razao social deve ser informada.'})
  razao_social: string;

  @IsNotEmpty({message: 'Um CPF/CNPJ deve ser informado.'})
  cpf_cnpj: string;

}
