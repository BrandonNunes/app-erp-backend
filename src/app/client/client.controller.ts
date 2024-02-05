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
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import ValidateUtils from "../utils/validateUtils";
import {LojaService} from "../loja/loja.service";
import {Bit, Char, DateTime, Int, Request, Table, VarChar} from "mssql";
import {DatabaseService} from "../../database/database.service";
import {DeleteClientDto} from "./dto/delete-client.dto";
import {ApiTags} from "@nestjs/swagger";

export type QueryParamsClientTypes = {
  empresa: string;
  filtro: string;
  usuario: string | null;
  limite: number
  idioma: string
  sequencial: number
};

@ApiTags('Clientes')
@Controller('cliente')
export class ClientController {
  constructor(
      private readonly clientService: ClientService,
      private readonly validUtils: ValidateUtils,
      private readonly lojaService: LojaService,
      private database: DatabaseService
              ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Res() response: Response, @Body() createClientDto: CreateClientDto) {
    try{
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('cliente', Int())
      tempTableForList.columns.add('nome', VarChar(100))
      tempTableForList.columns.add('razao_social', VarChar(100))
      tempTableForList.columns.add('cpf_cnpj', VarChar(14))
      tempTableForList.columns.add('rg_ie', VarChar(20))
      tempTableForList.columns.add('orgao_expeditor', VarChar(15))
      tempTableForList.columns.add('data_nascimento', DateTime())
      tempTableForList.columns.add('segmento', Int())
      tempTableForList.columns.add('cep', VarChar(8))
      tempTableForList.columns.add('tipo_logradouro', VarChar(10))
      tempTableForList.columns.add('endereco', VarChar(100))
      tempTableForList.columns.add('logradouro', VarChar(15))
      tempTableForList.columns.add('complemento', VarChar(100))
      tempTableForList.columns.add('bairro', Int())
      tempTableForList.columns.add('cidade', Int())
      tempTableForList.columns.add('fone_ddd1', VarChar(2))
      tempTableForList.columns.add('telefone1', VarChar(15))
      tempTableForList.columns.add('situacao', Char(7))
      tempTableForList.columns.add('uf', Char(2))
      tempTableForList.columns.add('datacadastro', DateTime())
      tempTableForList.columns.add('email', VarChar(50))
      tempTableForList.columns.add('CodigoExterno', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      createClientDto.list = createClientDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createClientDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(createClientDto.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', createClientDto.empresa);
      request.input('list', tempTableForList);
      request.input('usuario', createClientDto.usuario);
      request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Cliente_Inserir');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(HttpStatus.ACCEPTED).json(returnProcedure);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
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
      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('empresa', queryParams.empresa);
      await request.input('filtro', queryParams.filtro);
      await request.input('usuario', queryParams.usuario);
      await request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      queryParams.sequencial && await request.input('sequencial', queryParams.sequencial);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Cliente_Obter');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure && returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(200).json(returnProcedure);
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


  @Put()
  async update(@Res() response: Response, @Body() updateClientDto: CreateClientDto) {

    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('cliente', Int())
      tempTableForList.columns.add('nome', VarChar(100))
      tempTableForList.columns.add('razao_social', VarChar(100))
      tempTableForList.columns.add('cpf_cnpj', VarChar(14))
      tempTableForList.columns.add('rg_ie', VarChar(20))
      tempTableForList.columns.add('orgao_expeditor', VarChar(15))
      tempTableForList.columns.add('data_nascimento', DateTime())
      tempTableForList.columns.add('segmento', Int())
      tempTableForList.columns.add('cep', VarChar(8))
      tempTableForList.columns.add('tipo_logradouro', VarChar(10))
      tempTableForList.columns.add('endereco', VarChar(100))
      tempTableForList.columns.add('logradouro', VarChar(15))
      tempTableForList.columns.add('complemento', VarChar(100))
      tempTableForList.columns.add('bairro', Int())
      tempTableForList.columns.add('cidade', Int())
      tempTableForList.columns.add('fone_ddd1', VarChar(2))
      tempTableForList.columns.add('telefone1', VarChar(15))
      tempTableForList.columns.add('situacao', Char(7))
      tempTableForList.columns.add('uf', Char(2))
      tempTableForList.columns.add('datacadastro', DateTime())
      tempTableForList.columns.add('email', VarChar(50))
      tempTableForList.columns.add('CodigoExterno', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      updateClientDto.list = updateClientDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updateClientDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(updateClientDto.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', updateClientDto.empresa);
      request.input('list', tempTableForList);
      request.input('usuario', updateClientDto.usuario);
      request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Cliente_Alterar');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(HttpStatus.ACCEPTED).json(returnProcedure);
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete()
  async remove(@Res() response: Response, @Body() deleteClientDto: DeleteClientDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('sequencial', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      deleteClientDto.list = deleteClientDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      deleteClientDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(deleteClientDto.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', deleteClientDto.empresa);
      request.input('list', tempTableForList);
      request.input('usuario', deleteClientDto.usuario);
      request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Cliente_Excluir');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(HttpStatus.ACCEPTED).json(returnProcedure);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro });
    }
  }
}
