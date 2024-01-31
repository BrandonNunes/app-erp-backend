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
import {DataType, Sequelize} from 'sequelize-typescript';
import {LojaService} from "../loja/loja.service";
import {ApiQuery, ApiTags} from "@nestjs/swagger";
import {DataTypes, QueryTypes} from "sequelize";

export type QueryParamsUsesTypes = {
  empresa: string;
  id?: number;
  ativo: boolean;
  organizacao: string;
};

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private lojaService: LojaService,
    private sequelize: Sequelize,
  ) {}

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
     // return response.json(createUsuarioDto);
    //  const newUser = await this.usuarioService.createUser(createUsuarioDto);
      // Definição do modelo para a tabela temporária
      const defineTypesList = {
        id: {type: DataType.INTEGER, primaryKey: true},
        usuario: DataType.STRING(50),
        email: DataType.STRING(1000),
        cpf_cnpj: DataType.STRING(14),
        rg_ie: DataType.STRING(20),
        orgao_expeditor: DataType.INTEGER,
        data_nascimento: DataType.DATE,
        cep: DataType.STRING(8),
        tipo_logradouro: DataType.STRING(10),
        endereco: DataType.STRING(100),
        logradouro: DataType.STRING(15),
        complemento: DataType.STRING(100),
        bairro: DataType.STRING(50),
        cidade: DataType.INTEGER,
        uf: DataType.CHAR(2),
        tema: DataType.INTEGER,
        ativo: DataType.BOOLEAN,
        grupos: DataType.STRING(50),
        fone_ddd: DataType.STRING(2),
        telefone: DataType.STRING(15),
        CodigoExterno: DataType.STRING(20),

      }
      // Object.keys(createUsuarioDto.list[0]).forEach((key) => {
      //  // console.log(key)
      //   if (String(key) == 'id') {
      //     defineTypesList[key] = { type: DataTypes.STRING, primaryKey: true}
      //   }else {
      //     defineTypesList[key] = {type: DataTypes.STRING,}
      //   }
      // })

     // // return response.json(defineTypesList)
      const MinhaTabelaTemp = this.sequelize.define('MinhaTabelaTemp', {
      ...defineTypesList
      }, {
        // Defina o nome da tabela para o tipo de tabela temporária
        tableName: 'MinhaTabelaTemp',
        timestamps: false,
      });
      await MinhaTabelaTemp.sync({force: true})
      // Adicionar dados à tabela temporária
      const dadosCriados = await MinhaTabelaTemp.bulkCreate([...createUsuarioDto.list as any]);
      //const dataList = await this.sequelize.query('select * from MinhaTabelaTemp', {raw: true});

      //return response.json(dadosCriados)
      const newUser = await this.sequelize.query(`
      EXEC sp_Api_Usuario_Inserir @organizacao = :Organizacao, @list = :List`, {
        replacements: {
          Organizacao: createUsuarioDto.organizacao,
         List: [JSON.stringify(createUsuarioDto.list)]
        },
        type: QueryTypes.INSERT,
       raw: false
      });
      return response.send(newUser);
      // return response
      //   .status(HttpStatus.CREATED)
      //   .json({ message: 'Registro inserido com sucesso.', usuario: {
      //       ...newUser.dataValues,
      //       senha: undefined
      //     } });
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
