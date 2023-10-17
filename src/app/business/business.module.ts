import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "../usuario/entities/usuario.entity";
import {OrganizationModel} from "./entities/organizacao.entity";
import {EmpresaModel} from "./entities/company.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Users, OrganizationModel, EmpresaModel]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
