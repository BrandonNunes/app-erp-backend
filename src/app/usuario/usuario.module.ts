import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './entities/usuario.entity';
import { OrganizationModel } from '../business/entities/organizacao.entity';
import { EmpresaModel } from '../business/entities/company.entity';
import {BusinessModule} from "../business/business.module";

@Module({
  imports: [
    SequelizeModule.forFeature([Users, OrganizationModel, EmpresaModel]),
      BusinessModule,
    //   JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: 10 },
    // }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
