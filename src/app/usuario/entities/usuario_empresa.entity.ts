import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Users } from './usuario.entity';
import { EmpresaModel } from '../../business/entities/company.entity';

@Table({ tableName: 'usuarios_empresas', timestamps: false })
export class UsuarioEmpresaModel extends Model {
  @ForeignKey(() => Users)
  @Column
  id_usuario: number;

  @ForeignKey(() => EmpresaModel)
  @Column
  empresa: number;
}
