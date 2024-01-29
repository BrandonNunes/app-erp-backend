import { Module } from '@nestjs/common';
import { LojaService } from './loja.service';
import { LojaController } from './loja.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {LojaModel} from "./entities/loja.entity";
import ValidateUtils from "../utils/validateUtils";
import {OrganizacaoService} from "../organizacao/organizacao.service";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";

@Module({
  imports: [
      SequelizeModule.forFeature([LojaModel, OrganizacaoModel])
  ],
  controllers: [LojaController],
  providers: [LojaService, OrganizacaoService, ValidateUtils],
})
export class LojaModule {}
