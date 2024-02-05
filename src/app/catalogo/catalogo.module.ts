import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import {DatabaseService} from "../../database/database.service";
import {CatalogoItemController} from "./catalogo-item.controller";

@Module({
  controllers: [CatalogoController, CatalogoItemController],
  providers: [CatalogoService, DatabaseService],
})
export class CatalogoModule {}
