import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {Sequelize} from "sequelize-typescript";
import {SequelizeModule} from "@nestjs/sequelize";
import {ProductModel} from "./entities/product.entity";
import {GrupoProdutoModel} from "./entities/grupoProduto.entity";

@Module({
  imports:[ SequelizeModule.forFeature([ProductModel, GrupoProdutoModel]) ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
