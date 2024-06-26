import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import axios, {AxiosResponse} from "axios";
import { Response } from 'express'
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {DatabaseService} from "./database/database.service";
import {Bit, Char, DateTime, Int, Request, Table, VarChar} from "mssql";
import {QueryParamsCatalItemTypes} from "./app/catalogo/catalogo-item.controller";
import {ExecutarDto} from "./dto-others/executar.dto";
import {AuthGuard} from "./app/auth/auth.guard";

export type QueryParamsSegmentoTypes = {
  empresa: string
  limite: number
  idioma: string
  sequencial: number
};
export type QueryParamsCepTypes = {
  cep: string
  limite: number
  idioma: string
  sequencial: number
};
export type QueryParamsSellerInDateTypes = {
  empresa: string
  data_inicial: string
  data_final?: string
};
type QueryParamsRelatorioMob = {
  empresa: number;
  tipo: number;
  data_inicial: string;
  data_final: string;
  usuario?: string
  sequencial?: number
  limite?: number
}
@ApiTags('Outros')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly database: DatabaseService
     ) {}

  @ApiQuery({required: true, name: 'empresa'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'sequencial'})
  @Get('segmento')
  async findSegmentos(@Res() response: Response,
                @Query() queryParams: QueryParamsSegmentoTypes) {
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
      });
    }
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', queryParams.empresa);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      request.input('sequencial', queryParams.sequencial || 0);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Segmento_Obter');
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
  @ApiQuery({required: true, name: 'cep'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'sequencial'})
  @Get('cep')
  async findCepDne(@Res() response: Response,
                @Query() queryParams: QueryParamsCepTypes) {
    if (!queryParams.cep) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [cep] deve ser informado.',
      });
    }
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('cep', queryParams.cep);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      request.input('sequencial', queryParams.sequencial || 0);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_CepMira_Obter');
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
  @UseGuards(AuthGuard)
  @Post(['executar'])
  async executeProcess(@Res() response: Response,
                 @Body() bodyExecute: ExecutarDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('sequencial', Int())
      tempTableForList.columns.add('entidade', VarChar(100))
      tempTableForList.columns.add('tipo', Char(1))
      /**ADD SEQUENTIAL idType*/
      bodyExecute.list = bodyExecute.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      bodyExecute.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(bodyExecute.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', bodyExecute.empresa);
      request.input('list', tempTableForList);
      request.input('usuario', bodyExecute.usuario)
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Executar');
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
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'sequencial'})
  @Get('formapgto')
  async findFormasPgto(@Res() response: Response,
                      @Query() queryParams: {limite: number
                        idioma: string
                        sequencial: number}) {
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      request.input('sequencial', queryParams.sequencial || 0);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_FormaPgto_Obter');
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

  @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'empresa'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: true, name: 'sequencial'})
  @Get('pedidoformapgto')
  async findPedidoFormaPgto(@Res() response: Response,
                      @Query() queryParams: QueryParamsSegmentoTypes) {
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
      });
    }
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', queryParams.empresa);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      request.input('sequencial', queryParams.sequencial || 0);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_PedidoFormaPgto_Obter');
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

  // ENDPOINTS PARA APOIO APP MOBILE
  @ApiQuery({required: true, name: 'empresa'})
  @ApiQuery({required: true, name: 'data_inicial'})
  @ApiQuery({required: false, name: 'data_final'})
  @Get('vendido-hoje')
  async obterVendidoNoDia(@Res() response: Response,
                   @Query() queryParams: QueryParamsSellerInDateTypes) {
                    console.log(this.appService.validDate(queryParams.data_inicial))
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
      });
    }
    if (!queryParams.data_inicial) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [data_inicial] deve ser informado.',
      });
    }
    if (!this.appService.validDate(queryParams.data_inicial)) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: 'Formato de data inválido, esperado: yyyy-MM-dd'});
    }
    if (queryParams.data_final && !this.appService.validDate(queryParams.data_final)) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: 'Formato de data inválido, esperado: yyyy-MM-dd'});
    }
    try {
      const request = new Request(this.database.connection());
      const result = await request.query(`
      SELECT 
        empresa, 
        pedido, 
        data_pedido , 
        situacao , 
        valor_total , 
        valor_liquido , 
        valor_desconto , 
        Id 
      FROM pedidos 
      WHERE empresa = ${queryParams.empresa} 
      AND data_pedido >= '${queryParams.data_inicial}' 
      AND data_pedido <= '${queryParams.data_final ?? queryParams.data_inicial} 23:59:00'
      `)
     // const result = await request.execute('sp_Api_CepMira_Obter');
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


  @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'empresa'})
  @ApiQuery({required: true, name: 'tipo'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'sequencial'})
  @ApiQuery({required: true, name: 'data_inicial'})
  @ApiQuery({required: true, name: 'data_final'})
  @ApiQuery({required: false, name: 'usuario'})
  @Get('relatoriomob')
  async getRelatorioMob(@Res() response: Response,
                            @Query() queryParams: QueryParamsRelatorioMob) {
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
      });
    }else if (!queryParams.data_inicial) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [data_inicial] deve ser informado.',
      });
    }else if (!queryParams.data_final) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [data_final] deve ser informado.',
      });
    }else if (!queryParams.tipo) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [tipo] deve ser informado.',
      });
    }
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('empresa', queryParams.empresa);
      request.input('tipo', queryParams.tipo);
      request.input('data_inicial', queryParams.data_inicial);
      request.input('data_final', queryParams.data_final);
      request.input('usuario', queryParams.usuario);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      request.input('sequencial', queryParams.sequencial || 0);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_RelatorioMob_Obter');
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


}
