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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {Table, Request, VarChar, Int, DateTime, Char, Bit, ConnectionPool} from 'mssql'
// import { compareSync } from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import {DataType, Sequelize} from 'sequelize-typescript';
import {LojaService} from "../loja/loja.service";
import {ApiQuery, ApiTags} from "@nestjs/swagger";
import {DataTypes, QueryTypes} from "sequelize";
import * as process from "process";

export type QueryParamsUsesTypes = {
  empresa: string;
  id?: number;
  ativo: boolean;
  organizacao: string;
};

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  pool = new ConnectionPool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    server: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    options: {
      trustServerCertificate: true
    }

  })
  // @ts-ignore
  constructor(
    private readonly usuarioService: UsuarioService,
    private lojaService: LojaService,
    private sequelize: Sequelize,
  ) {

    this.pool.connect((err) => {
      if (err) {
        console.log(err);
      }
    })
  }

  // CRIAR NOVO USUARIO
  // @UseGuards(AuthGuard)
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
      const tvp = new Table();
      tvp.columns.add('idtype', Int())
      tvp.columns.add('id', Int())
      tvp.columns.add('usuario', VarChar(50))
      tvp.columns.add('email', VarChar(100))
      tvp.columns.add('cpf_cnpj', VarChar(14))
      tvp.columns.add('rg_ie', VarChar(20))
      tvp.columns.add('orgao_expeditor', Int())
      tvp.columns.add('data_nascimento', DateTime())
      tvp.columns.add('cep', VarChar(8))
      tvp.columns.add('tipo_logradouro', VarChar(10))
      tvp.columns.add('endereco', VarChar(100))
      tvp.columns.add('logradouro', VarChar(15))
      tvp.columns.add('complemento', VarChar(100))
      tvp.columns.add('bairro', Int())
      tvp.columns.add('cidade', Int())
      tvp.columns.add('uf', Char(2))
      tvp.columns.add('tema', Int())
      tvp.columns.add('ativo', Bit())
      tvp.columns.add('grupos', VarChar(50))
      tvp.columns.add('fone_ddd', VarChar(2))
      tvp.columns.add('telefone', VarChar(15))
      tvp.columns.add('CodigoExterno', VarChar(20))
      // add rows
      createUsuarioDto.list = createUsuarioDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      createUsuarioDto.list.forEach((item, index) => {
        tvp.rows.add(...Object.values(createUsuarioDto.list[index]))
      })
     // tvp.rows.add(...Object.values(createUsuarioDto.list[0]) as any)
      const request = new Request(this.pool);
      request.input('organizacao', createUsuarioDto.organizacao);
      request.input('list', tvp);
      const result = await request.execute('sp_Api_Usuario_Inserir');
      const returnProcedure = result.recordset;
      returnProcedure.forEach((resp, _, array) => {
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

  // OBTER USUARIOS
  // @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'organizacao'})
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
      const users = await this.usuarioService.getUsers(queryParams);
     // const users = await this.sequelize.query(`
     // select * from usuarios`)
      return response.json(users);
    } catch (erro) {
      console.log(erro);
      throw new HttpException(erro, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: erro,
      });
    }
  }

  // ATUALIZAR USUARIO
  // @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Res() response: Response,
    @Param('id') id,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    if (!id) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Usuário inválido' });
    }
    const user = await this.usuarioService.findOne(+id, updateUsuarioDto.organizacao);
    if (!user) return response.status(HttpStatus.NOT_FOUND).json({ message: 'Usuaário inválido ou inexistente.' })
    try {
      await this.usuarioService.update(+id, updateUsuarioDto);
      return response
        .status(HttpStatus.ACCEPTED)
        .json({ message: 'Usuário atualizado', usuario: updateUsuarioDto });
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }

 // @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
      @Res() response: Response,
      @Param('id') id: string,
      @Query() queryParam: QueryParamsUsesTypes) {
    if (!id) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Usuário inválido' });
    if (!queryParam.organizacao) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Uma organização deve ser informada' });
    const user = await this.usuarioService.findOne(+id, +queryParam.organizacao);
    if (!user) return response.status(HttpStatus.NOT_FOUND).json({ message: 'Usuário inválido ou inexistente.' });

    try {
      await this.usuarioService.remove(+id, +queryParam.organizacao);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Usuário excluído com sucesso.' })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro });
    }
  }
  // @UseGuards(AuthGuard)
  @Post('loja')
  async insertUserInCompany(
    @Res() response: Response,
    @Body() user_store: { organizacao: number, usuario_loja: { id_usuario: string, id_loja: string }[] },
  ) {
    try {
      const organization = user_store.organizacao;
      const validOrg =
        await this.usuarioService.validateOrganization(organization);
      if (!validOrg) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Organização inválida ou inexistente.' });
      }
      for (const empresa of user_store.usuario_loja ){
        const empresaAtualNaOrg = await this.lojaService.findOneLojaForUpdate(organization, empresa.id_loja);
        if (!empresaAtualNaOrg) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Uma ou mais empresas informadas não são válidas para esta organização.' })
      }
      await this.usuarioService.addUserCompany(user_store.usuario_loja);
      return response
        .status(HttpStatus.CREATED)
        .json({ message: 'Registros inseridos com sucesso.' });
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }
}
