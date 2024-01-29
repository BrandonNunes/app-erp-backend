import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import {UsuarioModel} from "./usuario.entity";
import {LojaModel} from "../../loja/entities/loja.entity";


@Table({ tableName: 'usuarios_loja', timestamps: false })
export class UsuarioLojaModel extends Model {
  @ForeignKey(() => UsuarioModel)
  @Column
  id_usuario: number;

  @ForeignKey(() => LojaModel)
  @Column
  id_loja: number;
}
