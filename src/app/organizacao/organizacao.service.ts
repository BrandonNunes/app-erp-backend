import { Injectable } from '@nestjs/common';
import { CreateOrganizacaoDto } from './dto/create-organizacao.dto';
import { UpdateOrganizacaoDto } from './dto/update-organizacao.dto';
import {InjectModel} from "@nestjs/sequelize";
import {OrganizacaoModel} from "./entities/organizacao.entity";
import {LojaModel} from "../loja/entities/loja.entity";

@Injectable()
export class OrganizacaoService {

  constructor(
      @InjectModel(OrganizacaoModel) private organizacaoModel: typeof OrganizacaoModel
  ) {
  }
  createNewOrg(newOragization: CreateOrganizacaoDto) {
    return this.organizacaoModel.create(newOragization as any);
  }

  async findAllOrganization() {
    return this.organizacaoModel.findAll();
  }

  findOneOrg(id: number) {
    return this.organizacaoModel.findByPk(id, {include: [LojaModel]});
  }

  updateOrg(id: number, orgData: UpdateOrganizacaoDto) {
    return this.organizacaoModel.update(orgData, { where: {id} });
  }

  removeOrg(id: number) {
    return this.organizacaoModel.destroy({ where: {id} });
  }
}
