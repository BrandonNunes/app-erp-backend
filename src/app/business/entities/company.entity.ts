import {
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table, UpdatedAt
} from 'sequelize-typescript';
import { Users } from '../../usuario/entities/usuario.entity';
import { UsuarioEmpresaModel } from '../../usuario/entities/usuario_empresa.entity';
import { v4 as uuidv4 } from 'uuid';
import {OrganizationModel} from "./organization.entity";

@Table({ tableName: 'empresas' })
export class EmpresaModel extends Model {

  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => OrganizationModel)
  @Column
  id_organizacao: number;

  @Column
  razao_social: string;

  @Column
  cpf_cnpj: string;

  @Column({defaultValue: true})
  ativo: boolean;

  @Column
  email: string;

  @Column({ allowNull: true ,defaultValue: null })
  nome_fantasia: string;

  @Column({ allowNull: true ,defaultValue: null })
  cep: string;

  @Column({ allowNull: true ,defaultValue: null })
  cidade: number;

  @Column({ allowNull: true ,defaultValue: null })
  bairro: number;

  @Column({ allowNull: true ,defaultValue: null })
  logradouro: string

  @Column({ allowNull: true ,defaultValue: null })
  numero: number

  @Column({ allowNull: true ,defaultValue: null })
  guid: string;

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date


  @BelongsToMany(() => Users, () => UsuarioEmpresaModel)
  usuarios: Users[];

  @BelongsTo(() => OrganizationModel, )
  organizacao: OrganizationModel;

  @BeforeCreate
  static autoUUID(company: EmpresaModel) {
    company.guid = uuidv4();
  }

  // @BeforeCreate
  // static autoRowVersion(company: EmpresaModel) {
  //   company.RowVersion = Buffer.from(Date.now().toString());
  // }

  // TODO - Má prática, id e qualquer codigo unico deve ser gerado de forma incremental
  // @BeforeCreate
  // static autoID(company: EmpresaModel) {
  //   company.empresa = Math.floor(Math.random() * 99999);
  // }
}


// Chave primaria não segue padrão ID,
// empresa(PK) não esta como auto-incremento
// Pr alguma razão a coluna empresa(PK) não é reconhecida como coluna de identidade pelo ORM, talvez algum atributo faltando na sua configuração
