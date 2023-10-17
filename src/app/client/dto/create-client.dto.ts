import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsNumber()
  cliente: number;
  @IsNotEmpty()
  nome: string;
  @IsNotEmpty()
  razao_social: string;
  @IsNotEmpty()
  cpf_cnpj: string;
  @IsNotEmpty()
  rg_ie: string;
  @IsNotEmpty()
  @IsNumber()
  segmento: number;
  @IsNotEmpty()
  cep: string;
  @IsNotEmpty()
  @IsString()
  tipo_logradouro: string;
  @IsNotEmpty()
  endereco: string; // Nome da rua
  @IsNotEmpty()
  logradouro?: string; // Numero da casa
  @IsString()
  complemento?: string;
  @IsNotEmpty()
  @IsNumber()
  bairro: number;
  @IsNotEmpty()
  @IsNumber()
  cidade: number;
  @IsNotEmpty()
  fone_ddd1?: string;
  @IsNotEmpty()
  telefone1?: string;
  @IsNotEmpty()
  situacao: string;
  @IsNotEmpty()
  uf: string;
  @IsNotEmpty()
  datacadastro: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  CodigoExterno: string;
  @IsString()
  orgao_expeditor: number | null;
  @IsString()
  data_nascimento: string | null;
}
