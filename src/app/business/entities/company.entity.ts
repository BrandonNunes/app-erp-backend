import {BeforeCreate, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import { Users } from '../../usuario/entities/usuario.entity';
import { UsuarioEmpresaModel } from '../../usuario/entities/usuario_empresa.entity';
import { v4 as uuidv4 } from 'uuid';
import {OrganizationModel} from "./organizacao.entity";

@Table({ tableName: 'empresas', timestamps: false })
export class EmpresaModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER, field: 'empresa', defaultValue: 0 })
  empresa: number;
  @ForeignKey(() => OrganizationModel)
  @Column
  idOrganizacao: number;
  @Column
  razao_social: string;
  @Column
  cnpj_cpf: string;
  @Column({defaultValue: 'ATIVO'})
  situacao: string;
  @Column
  email: string;
  @Column
  nome_fantasia: string;

  @Column
  cidade: number;

  @Column
  bairro: number;

  @Column
  guid: string;

  // @Column({type: DataType.TIME})
  // RowVersion: any

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