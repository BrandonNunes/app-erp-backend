import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  Res, Query, Put
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import {DatabaseService} from "../../database/database.service";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {Bit, Char, DateTime, Int, Numeric, Request, Table, VarChar} from "mssql";
import {Response} from "express";
import {QueryParamsUsesTypes} from "../usuario/usuario.controller";
import {DeleteUsuarioDto} from "../usuario/dto/delete-usuario.dto";
import {DeletePedidoDto} from "./dto/delete-pedido.dto";

export type QueryParamsPedidoTypes = {
  empresa: string;
 // filtro: string;
  usuario: string | null;
  limite: number
  idioma: string
  sequencial: number
};

@ApiTags('Pedido')
@ApiBearerAuth()
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService, private database: DatabaseService) {}

  @Post()
  async create(@Res() response: Response, @Body() createPedidoDto: CreatePedidoDto) {
    try {
      /** CREATE TABLE LIST PEDIDO*/
      const tempTableForListPedido = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListPedido.columns.add('idtype', Int())
      tempTableForListPedido.columns.add('pedido', Int())
      tempTableForListPedido.columns.add('cliente', Int())
      tempTableForListPedido.columns.add('data_pedido', DateTime())
      tempTableForListPedido.columns.add('observacao', VarChar())
      tempTableForListPedido.columns.add('situacao', Char(10))
      tempTableForListPedido.columns.add('valor_total', Int())
      tempTableForListPedido.columns.add('valor_desconto', Int())
      tempTableForListPedido.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      createPedidoDto.listPedido = createPedidoDto.listPedido.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createPedidoDto.listPedido.forEach((_, index) => {
        tempTableForListPedido.rows.add(...Object.values(createPedidoDto.listPedido[index]))
      });
      /** CREATE TABLE LIST ITEM*/
      const tempTableForListItem = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListItem.columns.add('idtype', Int())
      tempTableForListItem.columns.add('pedido', Int())
      tempTableForListItem.columns.add('produto', VarChar(18))
      tempTableForListItem.columns.add('quantidade', Int())
      tempTableForListItem.columns.add('valor_unitario', Int())
      tempTableForListItem.columns.add('valor_total', Int())
      tempTableForListItem.columns.add('valor_desconto', Int())
      tempTableForListItem.columns.add('perc_desconto', Int())
      tempTableForListItem.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      createPedidoDto.listItem = createPedidoDto.listItem.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createPedidoDto.listItem.forEach((_, index) => {
        tempTableForListItem.rows.add(...Object.values(createPedidoDto.listItem[index]))
      });
      
      /** CREATE TABLE LIST ITEM ATRIBUTO*/
      const tempTableForListItemAtributo = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListItemAtributo.columns.add('idtype', Int())
      tempTableForListItemAtributo.columns.add('pedido', Int())
      tempTableForListItemAtributo.columns.add('produto', VarChar(18))
      tempTableForListItemAtributo.columns.add('id_produtos_atributos', Int())
      tempTableForListItemAtributo.columns.add('id_grupos_atributos', Int())
      tempTableForListItemAtributo.columns.add('valor', VarChar(255))
      tempTableForListItemAtributo.columns.add('CodigoExterno', VarChar(20))
      tempTableForListItemAtributo.columns.add('obrigatorio', Int())
      /**ADD SEQUENTIAL idType*/
      createPedidoDto.listItemAtributo = createPedidoDto.listItemAtributo.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createPedidoDto.listItemAtributo.forEach((_, index) => {
        tempTableForListItemAtributo.rows.add(...Object.values(createPedidoDto.listItemAtributo[index]))
      });

      /** CREATE TABLE LIST FORMA PGTO*/
      const tempTableForListFormaPgto = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListFormaPgto.columns.add('idtype', Int())
      tempTableForListFormaPgto.columns.add('pedido', Int())
      tempTableForListFormaPgto.columns.add('id_forma_pgto', Int())
      tempTableForListFormaPgto.columns.add('qtd_parcelas', Int())
      tempTableForListFormaPgto.columns.add('valor_parcela', Int())
      tempTableForListFormaPgto.columns.add('valor_total', Int())
      tempTableForListFormaPgto.columns.add('dia_vencimento_parcela', Int())
      tempTableForListFormaPgto.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      createPedidoDto.listFormaPgto = createPedidoDto.listFormaPgto.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createPedidoDto.listFormaPgto.forEach((_, index) => {
        tempTableForListFormaPgto.rows.add(...Object.values(createPedidoDto.listFormaPgto[index]))
      });

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', createPedidoDto.empresa);
      request.input('listPedido', tempTableForListPedido);
      request.input('listItem', tempTableForListItem);
      request.input('listItemAtributo', tempTableForListItemAtributo);
      request.input('listFormaPgto', tempTableForListFormaPgto);
      request.input('usuario', createPedidoDto.usuario);
      /**EXECUTE PROCEDURE*/
      //return response.send(tempTableForListPedido)
      const result = await request.execute('sp_Api_Pedido_Inserir');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(201).json(returnProcedure);
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'empresa'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'usuario'})
  @ApiQuery({required: false, name: 'sequencial'})
  @Get()
  async findAll(
      @Res() response: Response,
      @Query() queryParams: QueryParamsPedidoTypes,
  ) {
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
      });
    }
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', queryParams.empresa);
      request.input('usuario', queryParams.usuario);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      request.input('sequencial', queryParams.sequencial || 0);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Pedido_Obter');
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
      throw new HttpException(erro, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: erro,
      });
    }
  }

  @Put()
  async update(@Res() response: Response, @Body() updatePedidoDto: CreatePedidoDto) {
    try {
      /** CREATE TABLE LIST PEDIDO */
      const tempTableForListPedido = new Table();
      /** ADD COLUMNS AND TYPING */
      tempTableForListPedido.columns.add('idtype', Int())
      tempTableForListPedido.columns.add('pedido', Int())
      tempTableForListPedido.columns.add('cliente', Int())
      tempTableForListPedido.columns.add('data_pedido', DateTime())
      tempTableForListPedido.columns.add('observacao', VarChar())
      tempTableForListPedido.columns.add('situacao', Char(10))
      tempTableForListPedido.columns.add('valor_total', Int())
      tempTableForListPedido.columns.add('valor_desconto', Int())
      tempTableForListPedido.columns.add('CodigoExterno', VarChar(20))
      /** ADD SEQUENTIAL idType */
      updatePedidoDto.listPedido = updatePedidoDto.listPedido.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updatePedidoDto.listPedido.forEach((_, index) => {
        tempTableForListPedido.rows.add(...Object.values(updatePedidoDto.listPedido[index]))
      });
      /** CREATE TABLE LIST ITEM */
      const tempTableForListItem = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListItem.columns.add('idtype', Int())
      tempTableForListItem.columns.add('pedido', Int())
      tempTableForListItem.columns.add('produto', VarChar(18))
      tempTableForListItem.columns.add('quantidade', Int())
      tempTableForListItem.columns.add('valor_unitario', Int())
      tempTableForListItem.columns.add('valor_total', Int())
      tempTableForListItem.columns.add('valor_desconto', Int())
      tempTableForListItem.columns.add('perc_desconto', Int())
      tempTableForListItem.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      updatePedidoDto.listItem = updatePedidoDto.listItem.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updatePedidoDto.listItem.forEach((_, index) => {
        tempTableForListItem.rows.add(...Object.values(updatePedidoDto.listItem[index]))
      });
      /** CREATE TABLE LIST ITEM ATRIBUTO*/
      const tempTableForListItemAtributo = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListItemAtributo.columns.add('idtype', Int())
      tempTableForListItemAtributo.columns.add('pedido', Int())
      tempTableForListItemAtributo.columns.add('produto', VarChar(18))
      tempTableForListItemAtributo.columns.add('id_produtos_atributos', Int())
      tempTableForListItemAtributo.columns.add('id_grupos_atributos', Int())
      tempTableForListItemAtributo.columns.add('valor', VarChar(255))
      tempTableForListItemAtributo.columns.add('CodigoExterno', VarChar(20))
      tempTableForListItemAtributo.columns.add('obrigatorio', Int())
      /**ADD SEQUENTIAL idType*/
      updatePedidoDto.listItemAtributo = updatePedidoDto.listItemAtributo.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updatePedidoDto.listItemAtributo.forEach((_, index) => {
        tempTableForListItemAtributo.rows.add(...Object.values(updatePedidoDto.listItemAtributo[index]))
      });

      /** CREATE TABLE LIST FORMA PGTO*/
      const tempTableForListFormaPgto = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForListFormaPgto.columns.add('idtype', Int())
      tempTableForListFormaPgto.columns.add('pedido', Int())
      tempTableForListFormaPgto.columns.add('id_forma_pgto', Int())
      tempTableForListFormaPgto.columns.add('qtd_parcelas', Int())
      tempTableForListFormaPgto.columns.add('valor_parcela', Int())
      tempTableForListFormaPgto.columns.add('valor_total', Int())
      tempTableForListFormaPgto.columns.add('dia_vencimento_parcela', Int())
      tempTableForListFormaPgto.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      updatePedidoDto.listFormaPgto = updatePedidoDto.listFormaPgto.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updatePedidoDto.listFormaPgto.forEach((_, index) => {
        tempTableForListFormaPgto.rows.add(...Object.values(updatePedidoDto.listFormaPgto[index]))
      });

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', updatePedidoDto.empresa);
      request.input('listPedido', tempTableForListPedido);
      request.input('listItem', tempTableForListItem);
      request.input('listItemAtributo', tempTableForListItemAtributo);
      request.input('listFormaPgto', tempTableForListFormaPgto);
      request.input('usuario', updatePedidoDto.usuario);
      /**EXECUTE PROCEDURE*/
          //return response.send(tempTableForListPedido)
      const result = await request.execute('sp_Api_Pedido_Alterar');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(201).json(returnProcedure);
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }

  @Delete()
  async remove(@Res() response: Response,
         @Body() deletePedidoDto: DeletePedidoDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('sequencial', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      deletePedidoDto.list = deletePedidoDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      deletePedidoDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(deletePedidoDto.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', deletePedidoDto.empresa);
      request.input('list', tempTableForList);
      request.input('idioma', 'PT-BR');
      request.input('usuario', deletePedidoDto.usuario)
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Pedido_Excluir');
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
