import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './entities/usuario.entity';
import { OrganizationModel } from '../business/entities/organization.entity';
import { EmpresaModel } from '../business/entities/company.entity';
import {BusinessModule} from "../business/business.module";
import {BusinessService} from "../business/business.service";
import {ContractModel} from "../business/entities/contract.entity";
import {UsuarioEmpresaModel} from "./entities/usuario_empresa.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Users, OrganizationModel, EmpresaModel, EmpresaModel, ContractModel, UsuarioEmpresaModel]),
      BusinessModule,
    //   JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: 10 },
    // }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, BusinessService],
})
export class UsuarioModule {}
