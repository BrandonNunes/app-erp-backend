import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  HttpStatus,
  Put,
  HttpException, UseGuards
} from '@nestjs/common';
import { Response } from 'express'
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import ValidateUtils from "../utils/validateUtils";
import {OrganizacaoService} from "../organizacao/organizacao.service";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {Bit, Char, DateTime, Int, Request, Table, VarChar} from "mssql";
import {DatabaseService} from "../../database/database.service";
import {UsuarioService} from "../usuario/usuario.service";
import {DeleteStoreDto} from "./dto/delete-loja.dto";
import {AuthGuard} from "../auth/auth.guard";

export type QueryParamsBusiness = {
  filtro: string;
  usuario: string | null;
  organizacao: string;
  limite: number
  idioma: string
  sequencial: number
}

@ApiTags('Loja')
@ApiBearerAuth()
@Controller()
export class LojaController {
  constructor(
      private readonly lojaService: LojaService,
     // private readonly usuarioService: UsuarioService,
      private organizacaoService: OrganizacaoService,
      private validateUtils: ValidateUtils,
      private database: DatabaseService) {
  }

  @UseGuards(AuthGuard)
  @Post('loja')
  async createStore(@Res() response: Response, @Body() createLojaDto: CreateLojaDto) {
    try {
      // const organization = createLojaDto.organizacao;
      // const validOrg =
      //     await this.usuarioService.validateOrganization(organization);
      // if (!validOrg) {
      //   return response
      //       .status(HttpStatus.BAD_REQUEST)
      //       .json({ message: 'Organização inválida ou inexistente.' });
      // }

      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('razao_social', VarChar(75))
      tempTableForList.columns.add('cnpj_cpf', VarChar(14))
      tempTableForList.columns.add('cep', VarChar(8))
      tempTableForList.columns.add('uf', Char(2))
      tempTableForList.columns.add('tipo_logradouro', VarChar(10))
      tempTableForList.columns.add('endereco', VarChar(100))
      tempTableForList.columns.add('logradouro', VarChar(15))
      tempTableForList.columns.add('complemento', VarChar(100))
      tempTableForList.columns.add('cidade', Int())
      tempTableForList.columns.add('bairro', Int())
      tempTableForList.columns.add('contribuinte_ipi', Bit())
      tempTableForList.columns.add('id_regime_tributario', Int())
      tempTableForList.columns.add('fone_ddd1', VarChar(2))
      tempTableForList.columns.add('telefone1', VarChar(15))
      tempTableForList.columns.add('situacao', VarChar(15))
      tempTableForList.columns.add('empresa', Int())
      tempTableForList.columns.add('CodigoExterno', VarChar(20))
      tempTableForList.columns.add('nome_fantasia', VarChar(100))
      /**ADD SEQUENTIAL idType*/
      createLojaDto.list = createLojaDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createLojaDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(createLojaDto.list[index]))
      })

      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', createLojaDto.organizacao);
      await request.input('list', tempTableForList);
      await request.input('usuario', createLojaDto.usuario);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Loja_Inserir');
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @ApiQuery({required: true, name: 'organizacao'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'filtro'})
  @ApiQuery({required: false, name: 'sequencial'})
  @UseGuards(AuthGuard)
  @Get('loja')
  async findAllStores(@Res() response: Response, @Query() queryParams: QueryParamsBusiness ) {
    if (!queryParams.organizacao) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [organizacao] deve ser informado.',
      });
    }
    try {
      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', queryParams.organizacao);
      await request.input('filtro', queryParams.filtro);
      await request.input('usuario', queryParams.usuario);
      await request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      queryParams.sequencial && await request.input('sequencial', queryParams.sequencial);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Loja_Obter');
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
  @Put('loja')
  async updateCompany(@Res() response: Response, @Body() updateLojaDto: CreateLojaDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('razao_social', VarChar(75))
      tempTableForList.columns.add('cnpj_cpf', VarChar(14))
      tempTableForList.columns.add('cep', VarChar(8))
      tempTableForList.columns.add('uf', Char(2))
      tempTableForList.columns.add('tipo_logradouro', VarChar(10))
      tempTableForList.columns.add('endereco', VarChar(100))
      tempTableForList.columns.add('logradouro', VarChar(15))
      tempTableForList.columns.add('complemento', VarChar(100))
      tempTableForList.columns.add('cidade', Int())
      tempTableForList.columns.add('bairro', Int())
      tempTableForList.columns.add('contribuinte_ipi', Bit())
      tempTableForList.columns.add('id_regime_tributario', Int())
      tempTableForList.columns.add('fone_ddd1', VarChar(2))
      tempTableForList.columns.add('telefone1', VarChar(15))
      tempTableForList.columns.add('situacao', VarChar(15))
      tempTableForList.columns.add('empresa', Int())
      tempTableForList.columns.add('CodigoExterno', VarChar(20))
      tempTableForList.columns.add('nome_fantasia', VarChar(100))
      /**ADD SEQUENTIAL idType*/
      updateLojaDto.list = updateLojaDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updateLojaDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(updateLojaDto.list[index]))
      })

      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', updateLojaDto.organizacao);
      await request.input('list', tempTableForList);
      await request.input('usuario', updateLojaDto.usuario);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Loja_Alterar');
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

  @UseGuards(AuthGuard)
  @Delete('loja')
  async removeCompany(@Res() response: Response, @Body() deleteLojaDto: DeleteStoreDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('sequencial', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      deleteLojaDto.list = deleteLojaDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      deleteLojaDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(deleteLojaDto.list[index]))
      })

      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', deleteLojaDto.organizacao);
      await request.input('list', tempTableForList);
      await request.input('usuario', deleteLojaDto.usuario);
      await request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Loja_Excluir');
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

  @ApiQuery({required: true, name: 'organizacao'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: true, name: 'filtro'})
  @ApiQuery({required: false, name: 'sequencial'})
  @UseGuards(AuthGuard)
  @Get('lojausuario')
  async findAllStoresByUser(@Res() response: Response, @Query() queryParams: QueryParamsBusiness ) {
    if (!queryParams.organizacao) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [organizacao] deve ser informado.',
      });
    }
    if (!queryParams.filtro) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [filtro] deve ser informado.',
      });
    }
    try {
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', queryParams.organizacao);
      request.input('filtro', queryParams.filtro);
     // await request.input('usuario', queryParams.usuario);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      queryParams.sequencial && request.input('sequencial', queryParams.sequencial);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_LojaUsuario_Obter');
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
