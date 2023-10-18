import {
  BelongsTo,
  BelongsToMany,
  Column, CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table, UpdatedAt
} from 'sequelize-typescript';
import {EmpresaModel} from "./company.entity";
import {ContractModel} from "./contract.entity";

@Table({ tableName: 'organizacao' })
export class OrganizationModel extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => ContractModel)
  @Column({allowNull: true, defaultValue: null})
  id_contrato: number;

  @Column({allowNull: false})
  razao_social: string;

  @Column({allowNull: true, defaultValue: null})
  cpf_cnpj: string;

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @HasMany(() => EmpresaModel)
  empresas: EmpresaModel[];

  @BelongsTo(() => ContractModel)
  contrato: ContractModel
}
