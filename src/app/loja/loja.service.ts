import { Injectable } from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import {InjectModel} from "@nestjs/sequelize";
import {LojaModel} from "./entities/loja.entity";

@Injectable()
export class LojaService {
  constructor(
      @InjectModel(LojaModel) private lojaModel: typeof LojaModel
  ) {
  }
  create(createLojaDto: CreateLojaDto) {
    return this.lojaModel.create({...createLojaDto})
  }

  findAll() {
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

  update(id: string, updateLojaDto: UpdateLojaDto) {
    return this.lojaModel.update(updateLojaDto, {
      where: {
        id
      }
    })
  }

  remove(id: string) {
    return this.lojaModel.destroy({
      where: {
        id
      }
    })
  }
}