import {
  IsNotEmpty,
} from 'class-validator';

export class CreateContractDto {

  @IsNotEmpty({ message: 'Deve haver um responsável associado.' })
  responsavel: string;

  @IsNotEmpty({ message: 'O CPF/CNPJ do resposável deve ser informado.' })
  cpf_cnpj_responsavel: string;

  @IsNotEmpty({ message: 'O inicio do contratop deve ser informado.' })
  inicio_contrato: string

  @IsNotEmpty({ message: 'O fim do contratop deve ser informado.' })
  fim_contrato: string

}
