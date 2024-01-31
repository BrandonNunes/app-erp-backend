import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {UsuarioModel} from "../usuario/entities/usuario.entity";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsuarioModel) private usersModel: typeof UsuarioModel,
    @InjectModel(OrganizacaoModel) private organization: typeof OrganizacaoModel,
  ) {}

  async validateOrganization(id: number) {
    const organizacao = await this.organization.findByPk(id);
    return !!organizacao;
  }

  validIsEmail(login: string): boolean {
    const isEmail = login.includes('@');
    return isEmail;
  }
  searchUsersByEmail(email: string, organizacao?: number) {
    if (!organizacao) {
      return this.usersModel.findAll({ raw: true, where: { email } });
    }
    return this.usersModel.findOne({
      raw: true,
      where: { email, id_organizacao: organizacao },
    });
  }
  searchUsersByCpfCnpj(cpf_cnpj: string, organizacao?: number) {
    if (!organizacao) {
      return this.usersModel.findAll({ raw: true, where: { cpf_cnpj: cpf_cnpj } });
    }
    return this.usersModel.findOne({
      raw: true,
      where: { cpf_cnpj: cpf_cnpj, idOrganizacao: organizacao },
    });
  }

  getAllOrganizations() {
    return this.organization.findAll();
  }
}
