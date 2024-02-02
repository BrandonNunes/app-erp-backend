import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Optional } from 'sequelize';
import { QueryParamsUsesTypes } from './usuario.controller';
import {UsuarioLojaModel} from "./entities/usuario_loja.entity";
import {UsuarioModel} from "./entities/usuario.entity";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";
import {LojaModel} from "../loja/entities/loja.entity";

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(UsuarioModel) private usuarioModel: typeof UsuarioModel,
    @InjectModel(OrganizacaoModel) private organization: typeof OrganizacaoModel,
    @InjectModel(UsuarioLojaModel) private usuarioLojaModel: typeof UsuarioLojaModel,
    @InjectModel(LojaModel) private lojaModel: typeof LojaModel
  ) {}

  async validateOrganization(id: number) {
    const organizacao = await this.organization.findByPk(id);
    return !!organizacao;
  }

  getAllOrganizations() {
    return this.organization.findAll();
  }

  async createUser(createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioModel.create(
      createUsuarioDto as unknown as Optional<
        CreateUsuarioDto,
        keyof CreateUsuarioDto
      >,
    );
  }

  // getUsers(queryParams: QueryParamsUsesTypes) {
  //   if (queryParams.id) {
  //     return this.usuarioModel.findOne({
  //       where: {
  //         idOrganizacao: queryParams.organizacao,
  //         [Op.and]: {
  //           ativo: queryParams.ativo ? queryParams.ativo : true,
  //           id: queryParams.id,
  //         },
  //       },
  //       attributes: { exclude: ['senha'] },
  //       // include: [
  //       //   {
  //       //     model: LojaModel,
  //       //     attributes: {
  //       //       exclude: ['id_organizacao', 'razao_social', 'email'],
  //       //     },
  //       //   },
  //       // ],
  //     });
  //   }
  //   return this.usuarioModel.findAll({
  //     where: {
  //       idOrganizacao: queryParams.organizacao,
  //       // [Op.and]: {
  //       //   ativo: queryParams.ativo ? queryParams.ativo : true,
  //       // },
  //     },
  //     attributes: {exclude: ['senha']},
  //     // include: [
  //     //   {
  //     //     model: LojaModel,
  //     //     attributes: {
  //     //       exclude: ['id_organizacao', 'razao_social', 'email'],
  //     //     },
  //     //   },
  //     // ],
  //   });
  // }

  findOne(id: number, organizacao: number) {
    return this.usuarioModel.findOne({
      where: { id, [Op.and]: { id_organizacao: organizacao } },
      attributes: { exclude: ['senha'] },
      // include: [
      //   {
      //     model: LojaModel,
      //     attributes: {
      //       exclude: ['id_organizacao', 'razao_social', 'email'],
      //     },
      //   },
      // ],
    });
  }



  remove(id: number, organizacao: number) {
    return this.usuarioModel.destroy({where: { id, [Op.and]: { id_organizacao: organizacao } } });
  }

  async addUserCompany(listEmpresaUsuario: { id_usuario: string, id_loja: string }[]) {
    return this.usuarioLojaModel.bulkCreate(
      [
        ...listEmpresaUsuario
      ],
      {
        ignoreDuplicates: true,
      }
    )
  }
}
