import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
  HttpException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import ValidateUtils from "../utils/validateUtils";
import {LojaService} from "../loja/loja.service";

export type QueryParamsClientTypes = {
  loja: string;
  id?: string;
  ativo: string;
};
@Controller('clientes')
export class ClientController {
  constructor(
      private readonly clientService: ClientService,
      private readonly validUtils: ValidateUtils,
      private readonly lojaService: LojaService
              ) {}

  @Post()
  async create(@Res() response: Response, @Body() createClientDto: CreateClientDto) {
    try{
      const validCPF = this.validUtils.validarCPF(createClientDto.cpf);
      if (!validCPF) return response.status(HttpStatus.BAD_REQUEST).json({message: 'CPF inválido.'});
      const validStore = this.lojaService.findOne(createClientDto.id_loja);
      if (!validStore) return response.status(HttpStatus.BAD_REQUEST).json({message: 'Loja informada inválida.'});
      const existClientOnStore = await this.clientService.findOneClientOnStore(createClientDto.id_loja, createClientDto.cpf);
      if (existClientOnStore) return response.status(HttpStatus.CONFLICT).json({message: 'Cliente já possui cadastro nesta loja.'})
      const newClient = await this.clientService.create(createClientDto);
      return response.status(HttpStatus.CREATED).json({message: 'Registro criado com sucesso!', cliente: {...newClient.dataValues}})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

 // @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Res() response: Response,
    @Query() queryParams: QueryParamsClientTypes,
  ) {
    // console.log(queryParams);
    if (!queryParams.loja) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [loja] deve ser informado.',
      });
    }
    try {
      const clientes = await this.clientService.getClients(queryParams);
      return response.json(clientes);
    } catch (erro) {
      console.log(erro);
      throw new HttpException(
        'Erro do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: erro,
        },
      );
    }
  }

  // @Get(':id')
  // async findOne(@Res() response: Response, @Param('id') id: string, @Query('empresa') empresa: string) {
  //   if (!empresa[0]) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       message: 'O parametro [empresa] deve ser informado.'
  //     })
  //   }
  //   try {
  //     const cliente: any = await this.clientService.findOne(id, empresa[0]);
  //     if (cliente[0].nome)
  //     return response.json(cliente[0]);
  //   else
  //     return response.json(cliente);
  //   }catch(erro) {
  //     throw new HttpException('Erro do servidor', HttpStatus.INTERNAL_SERVER_ERROR, {
  //       cause: erro
  //     })
  //   }
  // }

  @Put(':id')
  async update(@Res() response: Response, @Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    const existClient = await this.clientService.findOne(id);
    if (!existClient) return response.status(404).json({message: 'Cliente inválido.'})
    try {
      await this.clientService.update(id, updateClientDto);
      return response.status(HttpStatus.ACCEPTED).json({
        message: 'Registro atualizado com sucesso.',
      });
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
