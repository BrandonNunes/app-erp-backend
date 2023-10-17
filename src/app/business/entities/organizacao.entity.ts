import {BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import {EmpresaModel} from "./company.entity";

@Table({ tableName: 'organizacao', timestamps: false })
export class OrganizationModel extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  descricao: string;

  @Column({allowNull: true, defaultValue: null})
  idcontrato: string | null;

  @Column({ defaultValue: new Date().toISOString()})
  datacadastro: string;

  @HasMany(() => EmpresaModel)
  empresas: EmpresaModel[];
}
