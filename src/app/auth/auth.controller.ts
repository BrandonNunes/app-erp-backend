import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Users } from '../usuario/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { OrganizationModel } from '../business/entities/organization.entity';
import { jwtConstants } from './constants';
import { Sequelize } from 'sequelize-typescript';
import {compareSync} from "bcrypt";

const expiresInToken = 60; // EX: '30s', '5m', '2h' '7d'
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private sequelize: Sequelize,
  ) {}

  /** Função responsável por Validar as credenciais e gerar o JWT */
  async autenticateUser(passSent: string, userData: Users, response: Response) {
     const comparePass = compareSync(passSent, userData.senha)
    // const comparePass: any = await this.sequelize.query(
    //   `SELECT PWDCOMPARE('${passSent}', 0x${Buffer.from(
    //     userData.senha,
    //     'utf8',
    //   ).toString('hex')}, 0)`,
    //   { raw: true },
    // );
    // if (!!!comparePass[0][0]['']) {
    if (!comparePass) {
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
      master: userData.usuario_master,
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
    @Body() body: { organizacao: number; login: string; senha: string },
  ) {
    try {
      if (body.organizacao) {
        const validOrganization = await this.authService.validateOrganization(
          body.organizacao,
        );
        if (!validOrganization) {
          return response.status(HttpStatus.NOT_FOUND).json({
            message: 'Organização inexistente.',
          });
        }

        if (this.authService.validIsEmail(body.login)) {
          const user = await this.authService.searchUsersByEmail(
            body.login,
            body.organizacao,
          );
          if (typeof user === 'object') {
            if (!user) {
              return response
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: 'Falha na autenticação' });
            }
            const userData = user as Users;
            // Logoca para login
            return this.autenticateUser(body.senha, userData, response);
          }
        } else {
          const user = await this.authService.searchUsersByCpfCnpj(
            body.login,
            body.organizacao,
          );
          if (typeof user === 'object') {
            if (!user) {
              return response
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: 'Falha na autenticação' });
            }
            /**Logica para login*/
            const userData = user as Users;
            return this.autenticateUser(body.senha, userData, response);
          }
          console.log('é cpfCnpj');
        }
      }
      // Caso não seja informado organização
      if (this.authService.validIsEmail(body.login)) {
        const users = await this.authService.searchUsersByEmail(body.login);
        return this.validateNoOrg(body.senha, users as Users[], response);
      } else {
        const users = await this.authService.searchUsersByCpfCnpj(body.login);
        return this.validateNoOrg(body.senha, users as Users[], response);
      }

      // return response.json({});
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno de servidor',
        erro,
      });
    }
  }
  async validateNoOrg(passSent: string, users: Users[], response: Response) {
    if ((users as Users[]).length === 0) {
      console.log('Nenhum usuario encontrado');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Falha na autenticação' });
    } else if ((users as Users[]).length > 1) {
      const listOrganizations = await this.authService.getAllOrganizations();
      const listOrgByUser: OrganizationModel[] = [];
      (users as Users[]).forEach((user, index) => {
        const orgUser = listOrganizations.find(
          (org) => org.id === user.id_organizacao,
        );
        if (orgUser) {
          listOrgByUser.push(orgUser);
        }
        if (index === (users as Users[]).length - 1) {
          return response.status(HttpStatus.CONFLICT).json({
            message: 'Usuário em mais de uma organização',
            organizacoes: listOrgByUser,
          });
        }
      });
    } else if ((users as Users[]).length === 1) {
      /**Logica para login*/
      await this.autenticateUser(passSent, users[0], response);
    }
  }
}
