import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Sequelize } from 'sequelize-typescript';
import {compareSync} from "bcrypt";
import {UsuarioModel} from "../usuario/entities/usuario.entity";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";
import {ApiTags} from "@nestjs/swagger";
import {LoginAuthDto} from "./dto/loginAuth.dto";
import {DatabaseService} from "../../database/database.service";
import {Char, DateTime, Int, Request, Table, VarChar} from "mssql";

const expiresInToken = '1d'; // EX: '30s', '5m', '2h' '7d'
@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private sequelize: Sequelize,
    private database: DatabaseService
  ) {}

  /** Função responsável por Validar as credenciais e gerar o JWT */

  async generateJWT(userData: any) {
    // Gerando JWT
    const payload = {
      sub: userData.id,
      nome: userData.nome,
      organizacao: userData.idOrganizacao,
      //  master: userData.usuario_master,
      super_user: userData.super_usuario
    };
    const tokenJWT = await this.jwtService.signAsync(payload, {
      privateKey: jwtConstants.secret,
      expiresIn: expiresInToken,
    });
    return {tokenJWT}
  }
  async autenticateUser(passSent: string, userData: UsuarioModel, response: Response) {
    // const comparePass = compareSync(passSent, userData.senha)
    const comparePass: any = await this.sequelize.query(
      `SELECT PWDCOMPARE('${passSent}', 0x${Buffer.from(
        userData.senha,
        'utf8',
      ).toString('hex')}, 0)`,
      { raw: true },
    );
    if (!!!comparePass[0][0]['']) {
   // if (!comparePass) {
      // Senha incompatível
      console.log('error pass');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Falha na Autenticação' });
    }
    // Gerando JWT
    const payload = {
      sub: userData.id,
      nome: userData.nome,
      organizacao: userData.id_organizacao,
    //  master: userData.usuario_master,
      super_user: userData.super_usuario
    };
    const tokenJWT = await this.jwtService.signAsync(payload, {
      privateKey: jwtConstants.secret,
      expiresIn: expiresInToken,
    });
    return response.status(HttpStatus.OK).json({
      acessToken: tokenJWT,
      usuario: {
        ...userData,
        senha: undefined,
      },
    });
  }

  // LOGIN
  @Post('login')
  async findAll(
    @Res() response: Response,
    @Body() body: LoginAuthDto,
  ) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('id_usuario', Int())
      tempTableForList.columns.add('usuario', VarChar(50))
      tempTableForList.columns.add('senha', VarChar(100))

      /**ADD SEQUENTIAL idType*/
      body.list = body.list.map((item, index) =>( {idtype: index+1, id_usuario: 0, ...item}))
      /**ADD ROWS*/
      body.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(body.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', body.organizacao);
      request.input('list', tempTableForList);
      request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Login_Autenticar');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.validar_organizacao) {
          return response.status(HttpStatus.CONFLICT).json(returnProcedure);
        }
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(401).json(resp);
        }
      })
      const { tokenJWT } = await this.generateJWT(returnProcedure[0])
      return response.status(HttpStatus.OK).json({
        acessToken: tokenJWT,
        ...returnProcedure[0]
      });
      // if (body.organizacao) {
      //   const validOrganization = await this.authService.validateOrganization(
      //     body.organizacao,
      //   );
      //   if (!validOrganization) {
      //     return response.status(HttpStatus.NOT_FOUND).json({
      //       message: 'Organização inexistente.',
      //     });
      //   }
      //
      //   if (this.authService.validIsEmail(body.login)) {
      //     const user = await this.authService.searchUsersByEmail(
      //       body.login,
      //       body.organizacao,
      //     );
      //     if (typeof user === 'object') {
      //       if (!user) {
      //         return response
      //           .status(HttpStatus.UNAUTHORIZED)
      //           .json({ message: 'Falha na autenticação' });
      //       }
      //       const userData = user as UsuarioModel;
      //       // Logica para login
      //       return this.autenticateUser(body.senha, userData, response);
      //     }
      //   } else {
      //     const user = await this.authService.searchUsersByCpfCnpj(
      //       body.login,
      //       body.organizacao,
      //     );
      //     if (typeof user === 'object') {
      //       if (!user) {
      //         return response
      //           .status(HttpStatus.UNAUTHORIZED)
      //           .json({ message: 'Falha na autenticação' });
      //       }
      //       /**Logica para login*/
      //       const userData = user as UsuarioModel;
      //       return this.autenticateUser(body.senha, userData, response);
      //     }
      //     console.log('é cpfCnpj');
      //   }
      // }
      // // Caso não seja informado organização
      // if (this.authService.validIsEmail(body.login)) {
      //   const users = await this.authService.searchUsersByEmail(body.login);
      //   return this.validateNoOrg(body.senha, users as UsuarioModel[], response);
      // } else {
      //   const users = await this.authService.searchUsersByCpfCnpj(body.login);
      //   return this.validateNoOrg(body.senha, users as UsuarioModel[], response);
      // }

      // return response.json({});
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }
  async validateNoOrg(passSent: string, users: UsuarioModel[], response: Response) {
    if ((users as UsuarioModel[]).length === 0) {
      console.log('Nenhum usuario encontrado');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Falha na autenticação' });
    } else if ((users as UsuarioModel[]).length > 1) {
      const listOrganizations = await this.authService.getAllOrganizations();
      const listOrgByUser: OrganizacaoModel[] = [];
      (users as UsuarioModel[]).forEach((user, index) => {
        const orgUser = listOrganizations.find(
          (org) => org.id === user.id_organizacao,
        );
        if (orgUser) {
          listOrgByUser.push(orgUser);
        }
        if (index === (users as UsuarioModel[]).length - 1) {
          return response.status(HttpStatus.CONFLICT).json({
            message: 'Usuário em mais de uma organização',
            organizacoes: listOrgByUser,
          });
        }
      });
    } else if ((users as UsuarioModel[]).length === 1) {
      /**Logica para login*/
      await this.autenticateUser(passSent, users[0], response);
    }
  }
}
