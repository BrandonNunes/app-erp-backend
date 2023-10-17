import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, HttpStatus, Put} from '@nestjs/common';
import { Response } from "express";
import { BusinessService } from './business.service';
import {CreateOrganizationDto} from "./dto/create-organization.dto";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDtoDto} from "./dto/update-company.dto";
import {UpdateOrganizationDto} from "./dto/update-organization.dto";

export type QueryParamsBusiness = {
  organizacao: string;
}

@Controller()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('organizacao')
  async createOrg(@Res() response: Response, @Body() newOrgdata: CreateOrganizationDto) {
    try {
      await this.businessService.createNewOrg(newOrgdata);
      return response.status(HttpStatus.CREATED).json(newOrgdata);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }

  @Get('organizacao')
  async findAllOrganization(@Res() response: Response) {
    try{
      const orgs = await this.businessService.findAllOrganization();
      return response.status(HttpStatus.OK).json(orgs);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro});
    }

  }

  @Get('organizacao/:id')
  async findOneOrg(@Res() response: Response, @Param('id') id: string) {
    try {
      const org = await this.businessService.findOneOrg(+id);
      if (!org) return response.status(HttpStatus.NOT_FOUND).json({message: 'Organização não encontrada.'});
      const companies = await this.businessService.findAllCompany({organizacao: id});
      return response.status(HttpStatus.OK).json({
        ...org.dataValues,
        empresas: companies
      });
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro })
    }
  }

  @Put('organizacao/:id')
  async updateOrg(@Res() response: Response, @Param('id') id: string, @Body() newOrgData: UpdateOrganizationDto) {
    const existOrg = await this.businessService.findOneOrg(+id);
    if (!existOrg) return response.status(404).json({message: 'Organização inválida.'})
    try {
      await this.businessService.updateOrg(+id, newOrgData);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Organização atualizada', newOrgData })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete('organizacao/:id')
  async removeOrg(@Res() response: Response, @Param('id') id: string) {
    const existOrg = await this.businessService.findOneOrg(+id);
    if (!existOrg) return response.status(404).json({message: 'Organização inválida.'});
    try {
      await this.businessService.removeOrg(+id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }
  /**-----EMPRESAS---------*/

  @Post('empresas')
  async createCompany(@Res() response: Response, @Body() newCompanydata: CreateCompanyDto) {
    try {
      await this.businessService.createNewCompany(newCompanydata);
      return response.status(HttpStatus.CREATED).json(newCompanydata);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }

  @Get('empresas')
  findAllCompany(@Query() queryParams: QueryParamsBusiness) {
    return this.businessService.findAllCompany(queryParams);
  }

  @Get('empresas/:id')
  async findOneCompany(@Res() response: Response, @Param('id') id: string) {
    try {
      const company = await this.businessService.findOneCompany(+id);
      if (!company) return response.status(HttpStatus.NOT_FOUND).json({message: 'Empresa não encontrada.'});
      return response.status(HttpStatus.OK).json(company);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro })
    }
  }

  @Put('empresas/:id')
  async updateCompany(@Res() response: Response, @Param('id') id: string, @Body() newOrgData: UpdateCompanyDtoDto) {
    const existOrg = await this.businessService.findOneCompany(+id);
    if (!existOrg) return response.status(404).json({message: 'Organização inválida.'})
    try {
      await this.businessService.updateCompany(+id, newOrgData);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Organização atualizada', newOrgData })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete('empresas/:id')
  async removeCompany(@Res() response: Response, @Param('id') id: string) {
    const existOrg = await this.businessService.findOneCompany(+id);
    if (!existOrg) return response.status(404).json({message: 'Organização inválida.'});
    try {
      await this.businessService.removeCompany(+id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

}
