import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {EmpresaModel} from "../business/entities/company.entity";
import {ProductModel} from "./entities/product.entity";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class ProductService {

  constructor(
      @InjectModel(ProductModel) private productModel: typeof ProductModel,
      private sequelize: Sequelize
  ) {
  }
  async createNewProduct(newProduct: CreateProductDto) {
    const listIdProducts: any[] = await this.sequelize.query(`SELECT Id FROM produtos`);
    const maxId = listIdProducts[0].map(id => id.Id)[listIdProducts[0].length -1];
    const keys = Object.keys(newProduct).join(',')
    const values = Object.values(newProduct).map(value => {
      if (typeof value === 'string') return `'${value}'`
      return value
    })

    return await this.sequelize.query(
        `INSERT INTO produtos(Id, ${keys})
                VALUES(${maxId + 1},${values})`
    );
  // return this.productModel.create({...newProduct, Id: maxId + 1} as any);
  }

  async findAllProducts(empresa: string) {
    if (empresa) {
      return this.productModel.findAll({
        where: { empresa }
      })
    }
    return this.productModel.findAll();
  }

  findOneProduct(id: number) {
    return this.productModel.findByPk(id, {include: [EmpresaModel]});
  }

  updateProduct(id: number, orgData: UpdateProductDto) {
    return this.productModel.update(orgData, { where: {id} });
  }

  removeProduct(id: number) {
    return this.productModel.destroy({ where: {id} });
  }
}
