import {Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, Query} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {Response} from "express";
import {CreateTipoProductDto} from "./dto/create-tipo-product.dto";
import {LojaService} from "../loja/loja.service";
import {OrganizacaoService} from "../organizacao/organizacao.service";


export type QueryParamsProduct = {
  loja: string; organizacao: string; id: string;
}
@Controller()
export class ProductController {
  constructor(
      private readonly productService: ProductService,
      private readonly lojaService: LojaService,
      private readonly organizacaoService: OrganizacaoService,
      ) {}

  @Post('produtos')
  async createProduct(@Res() response: Response, @Body() newProdData: CreateProductDto) {
    try {
      const validCode = await this.productService.findOneProductByCode(newProdData.codigo_produto);
      if (validCode) return response.status(HttpStatus.CONFLICT).json({message: 'Código de produto já existe.'})
      const tipoProd = await this.productService.findOneTypeProduct(newProdData.id_tipo_produto);
      if (!tipoProd) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Tipo de produto informado não é válido.' });
      const validOrg = await this.organizacaoService.findOneOrg(newProdData.id_organizacao);
      if (!validOrg) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Organização informada não é válida.' });
      if (newProdData.id_loja) {
        const validLoja = await this.lojaService.findOneLojaForUpdate(newProdData.id_organizacao, newProdData.id_loja);
        if (!validLoja) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'A loja informada não é uma loja válida.' })
      }
      await this.productService.createNewProduct(newProdData);
      return response.status(HttpStatus.CREATED).json(newProdData);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }

  @Get('produtos')
  async findAllProduct(@Res() response: Response, @Query() querys: QueryParamsProduct) {
    try{
      if (!querys.organizacao) return response.status(HttpStatus.BAD_REQUEST).json({message: 'Por favor forneça uma organização para consulta.'})
      const prods = await this.productService.findAllProducts(querys);
      return response.status(HttpStatus.OK).json(prods);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro});
    }
  }

  @Get('produtos/:id')
  async findOneProduct(@Res() response: Response, @Param('id') id: string) {
    try {
      const prod = await this.productService.findOneProduct(id);
      if (!prod) return response.status(HttpStatus.NOT_FOUND).json({message: 'Produto não encontrado.'});
    //  const companies = await this.productService.findAllCompany({organizacao: id});
      return response.status(HttpStatus.OK).json(prod);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro })
    }
  }

  @Put('produtos/:id')
  async updateProduct(@Res() response: Response, @Param('id') id: string, @Body() newProdData: UpdateProductDto) {
    const existOrg = await this.productService.findOneProduct(id);
    if (!existOrg) return response.status(404).json({message: 'Produto inválida.'})
    try {
      await this.productService.updateProduct(id, newProdData);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Produto atualizado', newProdData })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete('produtos/:id')
  async removeProduct(@Res() response: Response, @Param('id') id: string) {
    const existOrg = await this.productService.findOneProduct(id);
    if (!existOrg) return response.status(404).json({message: 'Produto inválido.'});
    try {
      await this.productService.removeProduct(id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  };
  //Tipo produto
  @Post('tipo-produto')
  async createTipoProduct(@Res() response: Response, @Body() newTypeProdData: CreateTipoProductDto) {
    try {
      const validOrg = await this.organizacaoService.findOneOrg(newTypeProdData.id_organizacao);
      if (!validOrg) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Organização informada não é válida.' });
      if (newTypeProdData.id_loja) {
        const validLoja = await this.lojaService.findOneLojaForUpdate(newTypeProdData.id_organizacao, newTypeProdData.id_loja);
        if (!validLoja) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'A loja informada não é uma loja válida.' })
      }
      await this.productService.createNewTipoProduto(newTypeProdData);
      return response.status(HttpStatus.CREATED).json({message: 'Registro criado com sucesso.', registro: newTypeProdData});
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }
  @Get('tipo-produto')
  async findAllTipoProduct(@Res() response: Response, @Query() params: { organizacao: string }) {
    try{
      const tipoProd = await this.productService.findAllTipoProducts(params.organizacao);
      return response.status(HttpStatus.OK).json(tipoProd);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro});
    }
  }
}
