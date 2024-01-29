import {IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateClientDto {

  @IsNotEmpty({message: 'Nome deve ser informado.'})
  @MinLength(5, {message: 'Nome inválido.'})
  nome: string;

  @IsOptional()
  @IsBoolean()
  ativo: boolean

  @IsNotEmpty({message: 'CPF deve ser informado.'})
  cpf: string;

  @IsNotEmpty({message: 'Cliente deve ser atribuido a uma loja.'})
  id_loja: string;

  @IsOptional()
  @MaxLength(13, {message: 'telefone excede o tamho maximo'})
  telefone: string;

  @IsOptional()
  data_nascimento: Date;
  @IsNotEmpty({message: 'CEP deve ser informado.'})
  @MaxLength(8, { message: 'CEP excede o tamanho máximo.' })
  cep: string;
  @IsNotEmpty({message: 'Estado deve ser informado.'})
  estado: string;
  @IsNotEmpty({message: 'Cidade deve ser informado.'})
  cidade: string;
  @IsNotEmpty({message: 'Bairro deve ser informado.'})
  bairro: string;
  @IsNotEmpty({message: 'Rua deve ser informado.'})
  rua: string;
  @IsOptional()
  numero: string;
  @IsOptional()
  @MaxLength(100, {message: 'Limite máximo para o campo complemento excedido(100).'})
  complemento: string;

}
