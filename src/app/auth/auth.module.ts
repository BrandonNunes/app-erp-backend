import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioService } from '../usuario/usuario.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {UsuarioModel} from "../usuario/entities/usuario.entity";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";
import {LojaModel} from "../loja/entities/loja.entity";
import {UsuarioLojaModel} from "../usuario/entities/usuario_loja.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([UsuarioModel, OrganizacaoModel, LojaModel, UsuarioLojaModel]),
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService, JwtService],
})
export class AuthModule {}
