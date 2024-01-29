import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {Sequelize} from "sequelize-typescript";
import {SequelizeModule} from "@nestjs/sequelize";
import {ProdutoModel} from "./entities/produto.entity";
import {TipoProdutoModel} from "./entities/tipo_produto.entity";
import {LojaModel} from "../loja/entities/loja.entity";
import {OrganizacaoModel} from "../organizacao/entities/organizacao.entity";
import {LojaService} from "../loja/loja.service";
import {OrganizacaoService} from "../organizacao/organizacao.service";

@Module({
  imports:[ SequelizeModule.forFeature([ProdutoModel, TipoProdutoModel, LojaModel, OrganizacaoModel]) ],
  controllers: [ProductController],
  providers: [ProductService, LojaService, OrganizacaoService],
})
export class ProductModule {}
