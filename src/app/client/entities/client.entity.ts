import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'clientes', timestamps: false })
export class Client extends Model {
  @Column({ primaryKey: true })
  cliente: number;
  @Column
  nome: string;
  @Column
  empresa: number;
  @Column
  razao_social: string;
  @Column({ field: 'cpf' })
  cpf_cnpj: string;
  @Column({ field: 'identidade' })
  rg_ie: string;
  @Column
  segmento: number;
  @Column
  cep: string;
  @Column
  tipo_logradouro: string;
  @Column
  endereco: string; // Nome da rua
  @Column
  logradouro?: string; // Numero da casa
  @Column
  complemento?: string;
  @Column
  bairro: number;
  @Column
  cidade: number;
  @Column
  fone_ddd1?: string;
  @Column
  telefone1?: string;
  @Column
  situacao: string;
  @Column
  uf: string;
  @Column
  datacadastro: string;
  @Column
  email: string;
  @Column
  CodigoExterno: string;
  @Column
  orgao_expeditor: number | null;
  @Column
  data_nascimento: string;
  @Column({ defaultValue: 'APP' })
  origem: string;
}
