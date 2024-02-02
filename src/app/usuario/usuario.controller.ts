import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpException,
  HttpStatus,
  Query,
  Put,
  UseGuards, Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {Table, Request, VarChar, Int, DateTime, Char, Bit, ConnectionPool} from 'mssql'
// import { compareSync } from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import {DataType, Sequelize} from 'sequelize-typescript';
import {LojaService} from "../loja/loja.service";
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {DataTypes, QueryTypes} from "sequelize";
import {DatabaseService} from "../../database/database.service";
import {DeleteUsuarioDto} from "./dto/delete-usuario.dto";

export type QueryParamsUsesTypes = {
  empresa: string;
  filtro: string;
  usuario: string | null;
  organizacao: string;
  limite: number
  idioma: string
  sequencial: number
};

@ApiTags('Usuario')
@ApiBearerAuth()
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private lojaService: LojaService,
    private database: DatabaseService
  ) {  }
  // OBTER USUARIOS
  @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'organizacao'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'filtro'})
  @ApiQuery({required: false, name: 'sequencial'})
  @Get()
  async findUsers(
      @Res() response: Response,
      @Query() queryParams: QueryParamsUsesTypes,
  ) {
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
      const result = await request.execute('sp_Api_Usuario_Obter');
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
// ATUALIZAR USUARIO
  @UseGuards(AuthGuard)
  @Put()
  async update(
      @Res() response: Response,
      @Body() updateUsuarioDto: CreateUsuarioDto,
  ) {
    try {
      const organization = updateUsuarioDto.organizacao;
      const validOrg =
          await this.usuarioService.validateOrganization(organization);
      if (!validOrg) {
        return response
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Organização inválida ou inexistente.' });
      }

     // return response.send('teste')
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('id', Int())
      tempTableForList.columns.add('usuario', VarChar(50))
      tempTableForList.columns.add('email', VarChar(100))
      tempTableForList.columns.add('cpf_cnpj', VarChar(14))
      tempTableForList.columns.add('rg_ie', VarChar(20))
      tempTableForList.columns.add('orgao_expeditor', Int())
      tempTableForList.columns.add('data_nascimento', DateTime())
      tempTableForList.columns.add('cep', VarChar(8))
      tempTableForList.columns.add('tipo_logradouro', VarChar(10))
      tempTableForList.columns.add('endereco', VarChar(100))
      tempTableForList.columns.add('logradouro', VarChar(15))
      tempTableForList.columns.add('complemento', VarChar(100))
      tempTableForList.columns.add('bairro', Int())
      tempTableForList.columns.add('cidade', Int())
      tempTableForList.columns.add('uf', Char(2))
      tempTableForList.columns.add('tema', Int())
      tempTableForList.columns.add('ativo', Bit())
      tempTableForList.columns.add('grupos', VarChar(50))
      tempTableForList.columns.add('fone_ddd', VarChar(2))
      tempTableForList.columns.add('telefone', VarChar(15))
      tempTableForList.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      updateUsuarioDto.list = updateUsuarioDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updateUsuarioDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(updateUsuarioDto.list[index]))
      })

      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', updateUsuarioDto.organizacao);
      await request.input('list', tempTableForList);
      await request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Usuario_Alterar');
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }

  // CRIAR NOVO USUARIO
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @Post()
  async create(
    @Res() response: Response,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    try {
      const organization = createUsuarioDto.organizacao;
      const validOrg =
        await this.usuarioService.validateOrganization(organization);
      if (!validOrg) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Organização inválida ou inexistente.' });
      }

      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('id', Int())
      tempTableForList.columns.add('usuario', VarChar(50))
      tempTableForList.columns.add('email', VarChar(100))
      tempTableForList.columns.add('cpf_cnpj', VarChar(14))
      tempTableForList.columns.add('rg_ie', VarChar(20))
      tempTableForList.columns.add('orgao_expeditor', Int())
      tempTableForList.columns.add('data_nascimento', DateTime())
      tempTableForList.columns.add('cep', VarChar(8))
      tempTableForList.columns.add('tipo_logradouro', VarChar(10))
      tempTableForList.columns.add('endereco', VarChar(100))
      tempTableForList.columns.add('logradouro', VarChar(15))
      tempTableForList.columns.add('complemento', VarChar(100))
      tempTableForList.columns.add('bairro', Int())
      tempTableForList.columns.add('cidade', Int())
      tempTableForList.columns.add('uf', Char(2))
      tempTableForList.columns.add('tema', Int())
      tempTableForList.columns.add('ativo', Bit())
      tempTableForList.columns.add('grupos', VarChar(50))
      tempTableForList.columns.add('fone_ddd', VarChar(2))
      tempTableForList.columns.add('telefone', VarChar(15))
      tempTableForList.columns.add('CodigoExterno', VarChar(20))
      /**ADD SEQUENTIAL idType*/
      createUsuarioDto.list = createUsuarioDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createUsuarioDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(createUsuarioDto.list[index]))
      })

      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', createUsuarioDto.organizacao);
      await request.input('list', tempTableForList);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Usuario_Inserir');
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
  @Delete()
  async remove(
      @Res() response: Response,
      @Body() deleteUsuarioDto: DeleteUsuarioDto) {

    try {
      const organization = deleteUsuarioDto.organizacao;
      const validOrg =
          await this.usuarioService.validateOrganization(organization);
      if (!validOrg) {
        return response
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Organização inválida ou inexistente.' });
      }

      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('sequencial', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      deleteUsuarioDto.list = deleteUsuarioDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      deleteUsuarioDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(deleteUsuarioDto.list[index]))
      })

      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      await request.input('organizacao', deleteUsuarioDto.organizacao);
      await request.input('list', tempTableForList);
      await request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Usuario_Excluir');
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
