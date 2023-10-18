import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany, HasOne,
  Model,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import {EmpresaModel} from "./company.entity";
import {OrganizationModel} from "./organization.entity";

@Table({ tableName: 'contratos' })
export class ContractModel extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  responsavel: string;

  @Column
  cpf_cnpj_responsavel: string;

  @Column({type: DataType.DATE, allowNull: true})
  inicio_contrato: Date

  @Column({type: DataType.DATE, allowNull: true})
  fim_contrato: Date

  @Column({ defaultValue: true })
  ativo: boolean

  @Column({ defaultValue: false })
  cancelado: boolean

  @Column({ allowNull: true })
  motivo_cancelamento: string;

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @HasOne(() => OrganizationModel)
  contrato: OrganizationModel

}
