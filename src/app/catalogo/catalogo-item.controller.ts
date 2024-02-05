import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Query,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CreateCatalogoDto } from './dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './dto/update-catalogo.dto';
import {AuthGuard} from "../auth/auth.guard";
import {ApiQuery, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {Request} from "mssql";
import {DatabaseService} from "../../database/database.service";

export type QueryParamsCatalItemTypes = {
  filtro: string;
  organizacao: string;
  limite: number
  idioma: string
  sequencial: number
};

@ApiTags('Catalogo')
@Controller('catalogoitem')
export class CatalogoItemController {
  constructor(private readonly catalogoService: CatalogoService, private database: DatabaseService) {}

  // @Post()
  // create(@Body() createCatalogoDto: CreateCatalogoDto) {
  //   return this.catalogoService.create(createCatalogoDto);
  // }

 @UseGuards(AuthGuard)
  @ApiQuery({required: true, name: 'organizacao'})
  @ApiQuery({required: false, name: 'limite'})
  @ApiQuery({required: false, name: 'filtro'})
  @ApiQuery({required: false, name: 'sequencial'})
  @Get()
  async findAll(@Res() response: Response,
                @Query() queryParams: QueryParamsCatalItemTypes) {
    if (!queryParams.organizacao) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'O parametro [organizacao] deve ser informado.',
      });
    }
    try {
      const request = await new Request(this.database.connection());
      /**ADD VARIABLES IN PROCEDURE*/
      request.input('organizacao', queryParams.organizacao);
      request.input('filtro', queryParams.filtro);
      request.input('limite', queryParams.sequencial ? 1 : queryParams.limite || 500);
      queryParams.sequencial && request.input('sequencial', queryParams.sequencial);
      // await request.input('idioma', queryParams.idioma);
      /**EXECUTE PROCEDURE*/
      const result = await request.execute('sp_Api_CatalogoItem_Obter');
      /**GET RETURN PROCEDURE*/
      const returnProcedure = result.recordset;
      /**VALIDATIONS AND RETURNS FOR CLIENT*/
      returnProcedure && returnProcedure.forEach((resp) => {
        if (resp.erro === "true" || resp.erro === true) {
          return response.status(400).json(resp);
        }
      })
      return response.status(200).json(returnProcedure);
    } catch (erro) {
      console.log(erro);
      throw new HttpException(erro, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: erro,
      });
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.catalogoService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCatalogoDto: UpdateCatalogoDto) {
  //   return this.catalogoService.update(+id, updateCatalogoDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.catalogoService.remove(+id);
  // }
}
