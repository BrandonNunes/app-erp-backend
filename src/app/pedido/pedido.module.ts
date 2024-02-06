import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import {DatabaseService} from "../../database/database.service";

@Module({
  controllers: [PedidoController],
  providers: [PedidoService, DatabaseService],
})
export class PedidoModule {}
