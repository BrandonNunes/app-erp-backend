import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './entities/client.entity';
import {LojaModel} from "../loja/entities/loja.entity";
import ValidateUtils from "../utils/validateUtils";
import {LojaService} from "../loja/loja.service";
import {DatabaseService} from "../../database/database.service";

@Module({
  imports: [SequelizeModule.forFeature([Client, LojaModel])],
  controllers: [ClientController],
  providers: [ClientService, ValidateUtils, LojaService, DatabaseService],
})
export class ClientModule {}
