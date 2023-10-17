import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../usuario/entities/usuario.entity';
import { OrganizationModel } from '../business/entities/organizacao.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users) private usersModel: typeof Users,
    @InjectModel(OrganizationModel) private organization: typeof OrganizationModel,
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
      where: { email, idOrganizacao: organizacao },
    });
  }
  searchUsersByCpfCnpj(cpf_cnpj: string, organizacao?: number) {
    if (!organizacao) {
      return this.usersModel.findAll({ raw: true, where: { cpf_cnpj } });
    }
    return this.usersModel.findOne({
      raw: true,
      where: { cpf_cnpj, idOrganizacao: organizacao },
    });
  }

  getAllOrganizations() {
    return this.organization.findAll();
  }
}
