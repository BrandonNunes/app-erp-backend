import { Injectable } from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import {InjectModel} from "@nestjs/sequelize";
import {LojaModel} from "./entities/loja.entity";
import {QueryParamsBusiness} from "./loja.controller";

@Injectable()
export class LojaService {
  constructor(
      @InjectModel(LojaModel) private lojaModel: typeof LojaModel
  ) {
  }
  create(createLojaDto: CreateLojaDto) {
    return this.lojaModel.create({...createLojaDto})
  }

  findAll(queryParams: QueryParamsBusiness) {
    if (queryParams.organizacao) {
      return this.lojaModel.findAll({
        where: {
          idOrganizacao: queryParams.organizacao
        }
      })
    }
    return this.lojaModel.findAll();
  }

  findOne(id: string) {
    return this.lojaModel.findByPk(id)
  }
  findOneLojaForUpdate(id_organizacao: number, id_loja: string) {
    return this.lojaModel.findOne({
      where: {
        id_organizacao,
        id: id_loja
      }
    })
  }

  findOneCpfCnpj(cpf_cnpj: string) {
    return this.lojaModel.findOne({where: {cpf_cnpj: cpf_cnpj}})
  }


  remove(id: string) {
    return this.lojaModel.destroy({
      where: {
        id
      }
    })
  }
}
