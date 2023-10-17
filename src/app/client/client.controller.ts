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

export type QueryParamsClientTypes = {
  empresa: string;
  id?: string;
  situacao: string;
};
@Controller('clientes')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Res() response: Response,
    @Query() queryParams: QueryParamsClientTypes,
  ) {
    // console.log(queryParams);
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
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
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
