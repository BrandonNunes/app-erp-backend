import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Sequelize } from "sequelize-typescript";
import {ProdutoModel} from "./entities/produto.entity";
import {LojaModel} from "../loja/entities/loja.entity";
import {TipoProdutoModel} from "./entities/tipo_produto.entity";
import {CreateTipoProductDto} from "./dto/create-tipo-product.dto";
import {QueryParamsProduct} from "./product.controller";
import {Op} from "sequelize";

@Injectable()
export class ProductService {

  constructor(
      @InjectModel(ProdutoModel) private productModel: typeof ProdutoModel,
      @InjectModel(TipoProdutoModel) private tipoProdutoModel: typeof TipoProdutoModel,
      private sequelize: Sequelize
  ) {
  }
  async createNewProduct(newProduct: CreateProductDto) {
    // const listIdProducts: any[] = await this.sequelize.query(`SELECT Id FROM produtos`);
    // const maxId = listIdProducts[0].map(id => id.Id)[listIdProducts[0].length -1];
    // const keys = Object.keys(newProduct).join(',')
    // const values = Object.values(newProduct).map(value => {
    //   if (typeof value === 'string') return `'${value}'`
    //   return value
    // })
    //
    // return await this.sequelize.query(
    //     `INSERT INTO produtos(Id, ${keys})
    //             VALUES(${maxId + 1},${values})`
    // );
  return this.productModel.create({...newProduct});
  }

  async findAllProducts(querys: QueryParamsProduct) {
    if (querys.loja) {
      return this.productModel.findAll({
        where: {
          id_organizacao: querys.organizacao,
          [Op.or]: {
            id_loja: querys.loja,
            produto_padrao: true,
    }
        }
      })
    }
    if (querys.id) {
      return this.productModel.findOne({
        where: { id: querys.id, id_organizacao: querys.organizacao }
      })
    }
    return this.productModel.findAll({
      where: {
        id_organizacao: querys.organizacao,
        produto_padrao: true,
        id_loja: null
        // [Op.or]: [{
        //   produto_padrao: true
        // }]
      }
    });
  }

  findOneProduct(id: string) {
    return this.productModel.findByPk(id, {include: [LojaModel]});
  }
  findOneProductByCode(code: string) {
    return this.productModel.findOne({
      where: {
        codigo_produto: code
      }
    });
  }

  updateProduct(id: string, prodData: UpdateProductDto) {
    return this.productModel.update(prodData, { where: {id} });
  }

  removeProduct(id: string) {
    return this.productModel.destroy({ where: {id} });
  }

  //Tipo produto
  async findAllTipoProducts(organizacao: string) {
    if (organizacao) {
      return this.tipoProdutoModel.findAll({
        where: { id_organizacao: organizacao }
      })
    }
    return this.tipoProdutoModel.findAll();
  }
  async createNewTipoProduto(newTypeData: CreateTipoProductDto) {
    return this.tipoProdutoModel.create({...newTypeData})
  }

  findOneTypeProduct(id: string) {
    return this.tipoProdutoModel.findByPk(id);
  }
}
