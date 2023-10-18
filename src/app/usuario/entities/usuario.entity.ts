import {
  Column,
  Model,
  Table,
  BeforeCreate,
  BelongsToMany,
  CreatedAt,
  UpdatedAt, ForeignKey
} from 'sequelize-typescript';
import { EmpresaModel } from '../../business/entities/company.entity';
import { UsuarioEmpresaModel } from './usuario_empresa.entity';
import { v4 as uuidv4 } from 'uuid';
import {genSaltSync, hashSync} from "bcrypt";
import {OrganizationModel} from "../../business/entities/organization.entity";

@Table({ tableName: 'usuarios' })
export class Users extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;
  @Column
  nome: string;
  @Column
  email: string;
  @Column
  cpf_cnpj: string;
  @Column
  senha: string;
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
  tema: number;

  @ForeignKey(() => OrganizationModel)
  @Column
  id_organizacao: number;
  @Column
  guid: string;
  @Column
  guid_foto?: string;

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @BelongsToMany(() => EmpresaModel, () => UsuarioEmpresaModel)
  empresas: EmpresaModel[];

  @BeforeCreate
  static hashPassword(user: Users) {
      if (user.senha) {
          const salt = genSaltSync(10);
          user.senha = hashSync(user.senha, salt);
      }
  }
  // @BeforeCreate
  // static autoLogon(user: Users) {
  //   const fullName = user.usuario.split(' ')
  //   let firstName = fullName[0];
  //   let lastName = fullName[fullName.length-1];
  //   user.logon = `${firstName}.${lastName}`.toUpperCase();
  // }
  @BeforeCreate
  static autoUUID(user: Users) {
    user.guid = uuidv4();
  }
}
