import {Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, Query} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {Response} from "express";

@Controller('produtos')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Res() response: Response, @Body() newProdData: CreateProductDto) {
    try {
      await this.productService.createNewProduct(newProdData);
      return response.status(HttpStatus.CREATED).json(newProdData);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }

  @Get()
  async findAllProduct(@Res() response: Response, @Query() params: { empresa: string }) {
    try{
      const prods = await this.productService.findAllProducts(params.empresa);
      return response.status(HttpStatus.OK).json(prods);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro});
    }
  }

  @Get(':id')
  async findOneProduct(@Res() response: Response, @Param('id') id: string) {
    try {
      const prod = await this.productService.findOneProduct(+id);
      if (!prod) return response.status(HttpStatus.NOT_FOUND).json({message: 'Produto não encontrado.'});
    //  const companies = await this.productService.findAllCompany({organizacao: id});
      return response.status(HttpStatus.OK).json(prod);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro })
    }
  }

  @Put(':id')
  async updateProduct(@Res() response: Response, @Param('id') id: string, @Body() newProdData: UpdateProductDto) {
    const existOrg = await this.productService.findOneProduct(+id);
    if (!existOrg) return response.status(404).json({message: 'Produto inválida.'})
    try {
      await this.productService.updateProduct(+id, newProdData);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Produto atualizado', newProdData })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete(':id')
  async removeProduct(@Res() response: Response, @Param('id') id: string) {
    const existOrg = await this.productService.findOneProduct(+id);
    if (!existOrg) return response.status(404).json({message: 'Produto inválido.'});
    try {
      await this.productService.removeProduct(+id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }
}
