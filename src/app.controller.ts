import {Controller, Get, HttpException, HttpStatus, Param, Query, Res} from '@nestjs/common';
import { AppService } from './app.service';
import axios, {AxiosResponse} from "axios";
import { Response } from 'express'
import {ApiQuery, ApiTags} from "@nestjs/swagger";
import {DatabaseService} from "./database/database.service";
import {Request} from "mssql";
import {QueryParamsCatalItemTypes} from "./app/catalogo/catalogo-item.controller";

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
@ApiTags('Outros')
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
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }


}
