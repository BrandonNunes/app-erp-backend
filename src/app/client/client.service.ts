import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes } from 'sequelize';
import { Client } from './entities/client.entity';
import { QueryParamsClientTypes } from './client.controller';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client) private clienteModel: typeof Client,
    private sequelize: Sequelize,
  ) {}
  create(createClientDto: CreateClientDto) {
    return this.clienteModel.create({...createClientDto});
  }

  getClients(queryParams: QueryParamsClientTypes) {
    // if (queryParams.id) {
    //   return this.clienteModel.findOne({
    //     where: {
    //       id_loja: queryParams.loja,
    //       ativo: queryParams.ativo != undefined ? queryParams.ativo : true,
    //       id: queryParams.id,
    //     },
    //   });
    // }
    return this.clienteModel.findAll({
      // where: {
      //   id_loja: queryParams.loja,
      //   ativo: queryParams.ativo != undefined ? queryParams.ativo : true,
      // },
    });
    // return this.clienteModel.findAll({attributes: ["nome", "cpf", "razao_social"],});
    //   return this.sequelize.query('EXEC sp_Api_Cliente_Obter @empresa=:empresa, @filtro=:filtro, @usuario=:usuario', {
    //     replacements: {empresa: queryParams.empresa, filtro: queryParams.filtro, usuario: queryParams.usuario},
    //     type: QueryTypes.SELECT,
    //     raw: true
    // })
  }

  findOne(id: string) {
    return this.clienteModel.findByPk(id)
  }
  findOneClientOnStore(loja: string, cpf: string) {
    return this.clienteModel.findOne({
      where: {
        id_loja: loja,
        cpf: cpf
      }
    })
  }

  update(id: string, updateClientDto) {
    return this.clienteModel.update({...updateClientDto}, {where: {id}});
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
