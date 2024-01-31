import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, HttpStatus, Put} from '@nestjs/common';
import { Response } from 'express'
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import ValidateUtils from "../utils/validateUtils";
import {OrganizacaoService} from "../organizacao/organizacao.service";
import {ApiQuery, ApiTags} from "@nestjs/swagger";

export type QueryParamsBusiness = {
  organizacao: string;
}

@ApiTags('Lojas')
@Controller('lojas')
export class LojaController {
  constructor(
      private readonly lojaService: LojaService,
      private organizacaoService: OrganizacaoService,
      private validateUtils: ValidateUtils) {
  }

  @Post()
  async createStore(@Res() response: Response, @Body() newCompanyData: CreateLojaDto) {
    try {
      if (newCompanyData.tipo_registro === 'PJ') {
        const validateCNPJ = this.validateUtils.validarCNPJ(newCompanyData.cpf_cnpj);
        if (!validateCNPJ) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'CNPJ inválido.' })
        const existCpfCnpj = await this.lojaService.findOneCpfCnpj(newCompanyData.cpf_cnpj.replace(/[\D]+/g,''));
        if (existCpfCnpj) return response.status(HttpStatus.CONFLICT).json({message: 'CNPJ já cadastrado.'})
      }
      if (newCompanyData.tipo_registro === 'PF') {
        const validateCPF = this.validateUtils.validarCPF(newCompanyData.cpf_cnpj);
        if (!validateCPF) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'CPF inválido.' })
        const existCpfCnpj = await this.lojaService.findOneCpfCnpj(newCompanyData.cpf_cnpj.replace(/[\D]+/g,''));
        if (existCpfCnpj) return response.status(HttpStatus.CONFLICT).json({message: 'CPF já cadastrado.'})
      }
      const validOrg = await this.organizacaoService.findOneOrg(newCompanyData.id_organizacao);
      if (!validOrg) return response.status(HttpStatus.BAD_REQUEST).json({message: 'Organização informada não é uma organização válida.'});
      const newStore = await this.lojaService.create(newCompanyData);
      return response.status(HttpStatus.CREATED).json({
        message: 'Registro criado com sucesso.',
        empresa: {...newStore.dataValues}
      });
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @ApiQuery({required: true, name: 'organizacao'})
  @Get()
  findAllStores(@Query() queryParams: QueryParamsBusiness ) {
    return this.lojaService.findAll(queryParams);
  }

  @Get(':id')
  async findOneCompany(@Res() response: Response, @Param('id') id: string) {
    try {
      const company = await this.lojaService.findOne(id);
      if (!company) return response.status(HttpStatus.NOT_FOUND).json({message: 'Loja não encontrada.'});
      return response.status(HttpStatus.OK).json(company);
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor', erro})
    }
  }

  @Put(':id')
  async updateCompany(@Res() response: Response, @Param('id') id: string, @Body() newCompanyData: UpdateLojaDto) {
    const existStore = await this.lojaService.findOne(id);
    if (!existStore) return response.status(404).json({message: 'Loja inválida.'})
    try {
      if (newCompanyData.tipo_registro === 'PJ') {
      const validateCNPJ = this.validateUtils.validarCNPJ(newCompanyData.cpf_cnpj);
      if (!validateCNPJ) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'CNPJ inválido.' })
    }
    if (newCompanyData.tipo_registro === 'PF') {
      const validateCPF = this.validateUtils.validarCPF(newCompanyData.cpf_cnpj);
      if (!validateCPF) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'CPF inválido.' })
    }

    await this.lojaService.update(id, newCompanyData);
    return response.status(HttpStatus.CREATED).json({
      message: 'Registro atualizado com sucesso.',
    });
  } catch (erro) {
    console.log(erro);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
  }
  }

  @Delete(':id')
  async removeCompany(@Res() response: Response, @Param('id') id: string) {

    try {
      const existStore = await this.lojaService.findOne(id);
      if (!existStore) return response.status(404).json({message: 'Loja inválida.'});
    //  if (existStore.matrix) return response.status(HttpStatus.BAD_REQUEST).json({message: 'Ação não permitida para este tipo de loja.'})
      await this.lojaService.remove(id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    } catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }
}
