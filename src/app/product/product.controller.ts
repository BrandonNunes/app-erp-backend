import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {Response} from "express";
import {LojaService} from "../loja/loja.service";
import {OrganizacaoService} from "../organizacao/organizacao.service";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {DatabaseService} from "../../database/database.service";
import {Table, Request, VarChar, Int, DateTime, Char, Bit, ConnectionPool, Decimal} from 'mssql'
import {AuthGuard} from "../auth/auth.guard";
import {DeleteProductDto} from "./dto/delete-product.dto";


export type QueryParamsProduct = {
  empresa: string;
 // filtro: string;
  usuario: string | null;
  produto: string | null
  organizacao: string;
  limite: number
  idioma: string
  sequencial: number
}
@ApiTags('Produto')
@ApiBearerAuth()
@Controller('produto')
export class ProductController {
  constructor(
      private readonly productService: ProductService,
      private readonly lojaService: LojaService,
      private readonly organizacaoService: OrganizacaoService,
      private database: DatabaseService
      ) {}

  @Post()
  async createProduct(@Res() response: Response, @Body() createProductDto: CreateProductDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('empresa', Int())
      tempTableForList.columns.add('produto', VarChar(18))
      tempTableForList.columns.add('descricao', VarChar(50))
      tempTableForList.columns.add('medida_base', Int())
      tempTableForList.columns.add('tipo_item', Int())
      tempTableForList.columns.add('situacao', VarChar(20))
      tempTableForList.columns.add('venda_padrao', Int())
      tempTableForList.columns.add('venda_minima', Int())
      tempTableForList.columns.add('venda_maxima', Int())
      tempTableForList.columns.add('obrigar_rastreamento', Bit())
      tempTableForList.columns.add('tamanho_numero_serie', Int())
      tempTableForList.columns.add('eh_recarga', Bit())
      tempTableForList.columns.add('eh_sem_estoque', Bit())
      tempTableForList.columns.add('eh_assinatura', Bit())
      tempTableForList.columns.add('marca', Int())
      tempTableForList.columns.add('grupo', Int())
      tempTableForList.columns.add('Id', Int())
      tempTableForList.columns.add('venda_varejo', Int())
      tempTableForList.columns.add('venda_atacado', Int())
      tempTableForList.columns.add('codigoSAP', VarChar(18))
      tempTableForList.columns.add('descricaoSAP', VarChar(50))
      tempTableForList.columns.add('CodigoExterno', VarChar(20))
      tempTableForList.columns.add('codigoEAN', VarChar(100))
      tempTableForList.columns.add('eh_alfanumerico', Bit())
      tempTableForList.columns.add('validade', Int())
      tempTableForList.columns.add('nao_movimenta_financeiro', Bit())

      /**ADD SEQUENTIAL idType*/
      createProductDto.list = createProductDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      createProductDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(createProductDto.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', createProductDto.organizacao);
      request.input('list', tempTableForList);
      request.input('usuario', createProductDto.usuario);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Produto_Inserir');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(201).json(returnProcedure);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }

  @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'organizacao'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: true, name: 'empresa'})
  @ApiQuery({required: false, name: 'sequencial'})
  @ApiQuery({required: false, name: 'produto'})
  @Get()
  async findAllProduct(@Res() response: Response, @Query() queryParams: QueryParamsProduct) {
    if (!queryParams.organizacao) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [organizacao] deve ser informado.',
      });
    }
    if (!queryParams.empresa) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [empresa] deve ser informado.',
      });
    }
    try{
      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', queryParams.organizacao);
      request.input('empresa', queryParams.empresa);
      queryParams.produto && request.input('produto', queryParams.produto);
      request.input('usuario', queryParams.usuario);
      queryParams.sequencial && request.input('sequencial', queryParams.sequencial);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Produto_Obter');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure && returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(200).json(returnProcedure);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro});
    }
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateProduct(@Res() response: Response, @Body() updateProductData: CreateProductDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('empresa', Int())
      tempTableForList.columns.add('produto', VarChar(18))
      tempTableForList.columns.add('descricao', VarChar(50))
      tempTableForList.columns.add('medida_base', Int())
      tempTableForList.columns.add('tipo_item', Int())
      tempTableForList.columns.add('situacao', VarChar(20))
      tempTableForList.columns.add('venda_padrao', Int())
      tempTableForList.columns.add('venda_minima', Int())
      tempTableForList.columns.add('venda_maxima', Int())
      tempTableForList.columns.add('obrigar_rastreamento', Bit())
      tempTableForList.columns.add('tamanho_numero_serie', Int())
      tempTableForList.columns.add('eh_recarga', Bit())
      tempTableForList.columns.add('eh_sem_estoque', Bit())
      tempTableForList.columns.add('eh_assinatura', Bit())
      tempTableForList.columns.add('marca', Int())
      tempTableForList.columns.add('grupo', Int())
      tempTableForList.columns.add('Id', Int())
      tempTableForList.columns.add('venda_varejo', Int())
      tempTableForList.columns.add('venda_atacado', Int())
      tempTableForList.columns.add('codigoSAP', VarChar(18))
      tempTableForList.columns.add('descricaoSAP', VarChar(50))
      tempTableForList.columns.add('CodigoExterno', VarChar(20))
      tempTableForList.columns.add('codigoEAN', VarChar(100))
      tempTableForList.columns.add('eh_alfanumerico', Bit())
      tempTableForList.columns.add('validade', Int())
      tempTableForList.columns.add('nao_movimenta_financeiro', Bit())

      /**ADD SEQUENTIAL idType*/
      updateProductData.list = updateProductData.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      updateProductData.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(updateProductData.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', updateProductData.organizacao);
      request.input('list', tempTableForList);
      request.input('usuario', updateProductData.usuario);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Produto_Alterar');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(201).json(returnProcedure);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async removeProduct(@Res() response: Response,
                      @Body() deleteProductDto: DeleteProductDto) {
    try {
      /**CREATE TABLE*/
      const tempTableForList = new Table();
      /**ADD COLUMNS AND TYPING*/
      tempTableForList.columns.add('idtype', Int())
      tempTableForList.columns.add('sequencial', VarChar(20))

      /**ADD SEQUENTIAL idType*/
      deleteProductDto.list = deleteProductDto.list.map((item, index) =>( {idtype: index+1, ...item}))
      /**ADD ROWS*/
      deleteProductDto.list.forEach((_, index) => {
        tempTableForList.rows.add(...Object.values(deleteProductDto.list[index]))
      })

      const request = new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', deleteProductDto.organizacao);
      request.input('empresa', deleteProductDto.empresa);
      request.input('usuario', deleteProductDto.usuario);
      request.input('list', tempTableForList);
      request.input('idioma', 'PT-BR');
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_Produto_Excluir');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(HttpStatus.ACCEPTED).json(returnProcedure);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  };

}
