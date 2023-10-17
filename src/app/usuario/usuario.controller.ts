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
// import { compareSync } from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { Sequelize } from 'sequelize-typescript';

export type QueryParamsUsesTypes = {
  empresa: string;
  id?: string;
  ativo: boolean;
  organizacao: string;
};

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private sequelize: Sequelize,
  ) {}

  // CRIAR NOVO USUARIO
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Res() response: Response,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    try {
      const organization = createUsuarioDto.idOrganizacao;
      const validOrg =
        await this.usuarioService.validateOrganization(organization);
      if (!validOrg) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Organização inválida ou inexistente.' });
      }
      /** USANDO FUNÇÃO DO BANCO PARA GERAR SENHA ENCRIPTADA
       *  Não segura, dificulta uma possível migração de DB,
       *  Possível incompatibilidade com versões mais recentes do SQLServer no futuro,
       *  Um dia havendo troca de estrategia:
       *   - desabilitar chamada ao banco abaixo e habilitar metodo de hash dentro do models de usuarios(bcrypt);
       * */
      /*----------------inicio---------------------------*/
      // const convertPass: any = await this.sequelize.query(
      //   `SELECT CONVERT(VARBINARY(100), pwdEncrypt(${createUsuarioDto.senha}))`,
      //   { raw: true },
      // );
      // createUsuarioDto.senha = convertPass[0][0][''];
      /*-----------------fim--------------------------*/
      const newUser = await this.usuarioService.createUser(createUsuarioDto);
      return response
        .status(HttpStatus.CREATED)
        .json({ ...createUsuarioDto, id: newUser.id, senha: undefined });
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }

  // OBTER USUARIOS
  @UseGuards(AuthGuard)
  @Get()
  async findUsers(
    @Res() response: Response,
    @Query() queryParams: QueryParamsUsesTypes,
  ) {
    console.log(queryParams);
    if (!queryParams.organizacao) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [organizacao] deve ser informado.',
      });
    }
    try {
      const users = await this.usuarioService.getUsers(queryParams);
      return response.json(users);
    } catch (erro) {
      console.log(erro);
      throw new HttpException(erro, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: erro,
      });
    }
  }

  // ATUALIZAR USUARIO
  @UseGuards(AuthGuard)
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
    const user = await this.usuarioService.findOne(+id, updateUsuarioDto.idOrganizacao);
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

  @UseGuards(AuthGuard)
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
}
