import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateOrganizationDto {

  // @IsNotEmpty({message: 'Um contrato deve ser informado.'})
  // idcontrato: number | null;

  @IsNotEmpty({message: 'Uma descrição deve ser informada.'})
  descricao: string;

}
