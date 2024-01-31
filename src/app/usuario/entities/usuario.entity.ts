import {
  Column,
  Model,
  Table,
  BeforeCreate,
  BelongsToMany,
  CreatedAt,
  UpdatedAt, ForeignKey, DataType
} from 'sequelize-typescript';
import { UsuarioLojaModel } from './usuario_loja.entity';
import { v4 as uuidv4 } from 'uuid';
import {genSaltSync, hashSync} from "bcrypt";
import {LojaModel} from "../../loja/entities/loja.entity";
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";

@Table({ tableName: 'usuarios', timestamps: false })
export class UsuarioModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;
 // @ForeignKey(() => OrganizacaoModel)
  @Column({field: 'idOrganizacao'})
  id_organizacao: number;
  @Column({field: 'usuario'})
  nome: string;
  @Column
  email: string;
  @Column
  cpf_cnpj: string;
  @Column
  senha: string;
  @Column
  data_nascimento: string
  @Column
  telefone: string
  @Column({ defaultValue: true })
  ativo: boolean;
  @Column({ defaultValue: 'APP' })
  origem: string;
  @Column({ defaultValue: false })
  alterar_senha_proximo_logon: boolean;
  @Column({ defaultValue: false })
  super_usuario: boolean;
  @Column({ defaultValue: false })
  usuario_master: boolean;
  @Column
  data_ultima_senha: string
  @Column
  data_ultimo_logon: string;
  @Column
  guid: string;
  @Column
  guid_foto: string;

  // @CreatedAt
  // createdAt: Date
  //
  // @UpdatedAt
  // updatedAt: Date
  //
  // @BelongsToMany(() => LojaModel, () => UsuarioLojaModel)
  // lojas: LojaModel[];

  // @BeforeCreate
  // static hashPassword(user: UsuarioModel) {
  //     if (user.senha) {
  //         const salt = genSaltSync(10);
  //         user.senha = hashSync(user.senha, salt);
  //     }
  // }
  // @BeforeCreate
  // static autoUUID(user: UsuarioModel) {
  //   user.id = uuidv4();
  // }

}
