import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
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
    return createClientDto;
  }

  getClients(queryParams: QueryParamsClientTypes) {
    if (queryParams.id) {
      return this.clienteModel.findOne({
        where: {
          empresa: queryParams.empresa,
          [Op.and]: {
            situacao: queryParams.situacao
              ? queryParams.situacao.toUpperCase()
              : 'ATIVO',
            cliente: queryParams.id,
          },
        },
      });
    }
    return this.clienteModel.findAll({
      where: {
        empresa: queryParams.empresa,
        [Op.and]: {
          situacao: queryParams.situacao
            ? queryParams.situacao.toUpperCase()
            : 'ATIVO',
        },
      },
    });
    // return this.clienteModel.findAll({attributes: ["nome", "cpf", "razao_social"],});
    //   return this.sequelize.query('EXEC sp_Api_Cliente_Obter @empresa=:empresa, @filtro=:filtro, @usuario=:usuario', {
    //     replacements: {empresa: queryParams.empresa, filtro: queryParams.filtro, usuario: queryParams.usuario},
    //     type: QueryTypes.SELECT,
    //     raw: true
    // })
  }

  findOne(id: string, empresa: string) {
    return this.sequelize.query(
      "EXEC sp_Api_Cliente_Obter @empresa=:empresa, @filtro='', @sequencial=:sequencial, @limite=1",
      {
        replacements: { empresa, sequencial: id },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return updateClientDto;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
