import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {UsuarioLojaModel} from "./entities/usuario_loja.entity";
import {UsuarioModel} from "./entities/usuario.entity";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";
import {LojaModel} from "../loja/entities/loja.entity";
import {LojaService} from "../loja/loja.service";
import Sql from 'mssql'

@Module({
  imports: [
    SequelizeModule.forFeature([UsuarioModel, OrganizacaoModel, LojaModel, UsuarioLojaModel]),
    //   JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: 10 },
    // }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, LojaService],
})
export class UsuarioModule {}
