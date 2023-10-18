import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "../usuario/entities/usuario.entity";
import {OrganizationModel} from "./entities/organization.entity";
import {EmpresaModel} from "./entities/company.entity";
import {ContractModel} from "./entities/contract.entity";
import {UsuarioEmpresaModel} from "../usuario/entities/usuario_empresa.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Users, OrganizationModel, EmpresaModel, ContractModel, UsuarioEmpresaModel]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
