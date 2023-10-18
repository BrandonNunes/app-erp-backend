import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './entities/usuario.entity';
import { OrganizationModel } from '../business/entities/organization.entity';
import { Op, Optional } from 'sequelize';
import { QueryParamsUsesTypes } from './usuario.controller';
import { EmpresaModel } from '../business/entities/company.entity';
import {UsuarioEmpresaModel} from "./entities/usuario_empresa.entity";

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Users) private usersModel: typeof Users,
    @InjectModel(OrganizationModel) private organization: typeof OrganizationModel,
    @InjectModel(UsuarioEmpresaModel) private usuarioEmpresaModel: typeof UsuarioEmpresaModel,
  ) {}

  async validateOrganization(id: number) {
    const organizacao = await this.organization.findByPk(id);
    return !!organizacao;
  }

  getAllOrganizations() {
    return this.organization.findAll();
  }

  async createUser(createUsuarioDto: CreateUsuarioDto) {
    return this.usersModel.create(
      createUsuarioDto as unknown as Optional<
        CreateUsuarioDto,
        keyof CreateUsuarioDto
      >,
    );
  }

  getUsers(queryParams: QueryParamsUsesTypes) {
    if (queryParams.id) {
      return this.usersModel.findOne({
        where: {
          id_organizacao: queryParams.organizacao,
          [Op.and]: {
            ativo: queryParams.ativo ? queryParams.ativo : true,
            id: queryParams.id,
          },
        },
        attributes: { exclude: ['senha'] },
        include: [
          {
            model: EmpresaModel,
            attributes: {
              exclude: ['id_organizacao', 'razao_social', 'cnpj_cpf', 'email'],
            },
          },
        ],
      });
    }
    return this.usersModel.findAll({
      where: {
        id_organizacao: queryParams.organizacao,
        [Op.and]: {
          ativo: queryParams.ativo ? queryParams.ativo : true,
        },
      },
      attributes: {exclude: ['senha']},
      include: [
        {
          model: EmpresaModel,
          attributes: {
            exclude: ['id_organizacao', 'razao_social', 'cnpj_cpf', 'email'],
          },
        },
      ],
    });
  }

  findOne(id: number, organizacao: number) {
    return this.usersModel.findOne({
      where: { id, [Op.and]: { id_organizacao: organizacao } },
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: EmpresaModel,
          attributes: {
            exclude: ['id_organizacao', 'razao_social', 'cnpj_cpf', 'email'],
          },
        },
      ],
    });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.usersModel.update(updateUsuarioDto, { where: { id } });
  }

  remove(id: number, organizacao: number) {
    return this.usersModel.destroy({where: { id, [Op.and]: { id_organizacao: organizacao } } });
  }

  async addUserCompany(listEmpresaUsuario: { id_usuario: number, id_empresa: number }[]) {
    return this.usuarioEmpresaModel.bulkCreate(
      [
        ...listEmpresaUsuario
      ],
      {
        ignoreDuplicates: true,
      }
    )
  }
}
