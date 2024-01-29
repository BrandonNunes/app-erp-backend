import {BeforeCreate, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt} from 'sequelize-typescript';
import {LojaModel} from "../../loja/entities/loja.entity";
import {v4 as uuidv4} from "uuid";

@Table({ tableName: 'clientes' })
export class Client extends Model {
  @Column({ primaryKey: true, type: DataType.UUIDV4 })
  id: string;

  @Column
  nome: string;
  @Column
  ativo: boolean;

  @Column
  cpf: string;

  @ForeignKey(() => LojaModel)
  @Column
  id_loja: string;
  @Column
  telefone: string;

  @Column
  data_nascimento: Date;
  @Column({allowNull: false})
  cep: string;
  @Column({allowNull: false})
  estado: string;
  @Column({allowNull: false})
  cidade: string;
  @Column({allowNull: false})
  bairro: string;
  @Column({allowNull: false})
  rua: string;
  @Column({defaultValue: 'S/N'})
  numero: string;

  @Column
  complemento: string;

  @CreatedAt
  createdAt: Date
  @UpdatedAt
  updatedAt: Date

  @BeforeCreate
  static autoUUID(client: Client) {
    client.id = uuidv4();
  }
  @BeforeCreate
  static removeNoNumbersCPF(client: Client) {
    client.cpf = client.cpf.replace(/[\D]+/g,'')
  }
}
