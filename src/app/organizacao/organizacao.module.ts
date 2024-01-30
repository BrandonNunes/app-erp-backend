import { Module } from '@nestjs/common';
import { OrganizacaoService } from './organizacao.service';
import { OrganizacaoController } from './organizacao.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {OrganizacaoModel} from "./entities/organizacao.entity";

@Module({
  imports:[SequelizeModule.forFeature([OrganizacaoModel])],
  controllers: [OrganizacaoController],
  providers: [OrganizacaoService],
})
export class OrganizacaoModule {}
