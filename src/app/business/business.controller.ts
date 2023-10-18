import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, HttpStatus, Put} from '@nestjs/common';
import { Response } from "express";
import { BusinessService } from './business.service';
import {CreateOrganizationDto} from "./dto/create-organization.dto";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDtoDto} from "./dto/update-company.dto";
import {UpdateOrganizationDto} from "./dto/update-organization.dto";
import {CreateContractDto} from "./dto/create-contract.dto";
import {UpdateContractDto} from "./dto/update-contract.dto";

export type QueryParamsBusiness = {
  organizacao: string;
}

@Controller()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('organizacao')
  async createOrg(@Res() response: Response, @Body() newOrgdata: CreateOrganizationDto) {
    try {
      const existContract = await this.businessService.findOneContract(newOrgdata.id_contrato);
      if (!existContract) return response.status(HttpStatus.BAD_REQUEST).json({ amessage: 'Um contrato válido deve ser fornecido.' })
      const newOrg = await this.businessService.createNewOrg(newOrgdata);
      return response.status(HttpStatus.CREATED).json({ message: 'Registro criado com sucesso.', organizacao: { ...newOrg.dataValues } });
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
     // const companies = await this.businessService.findAllCompany({organizacao: id});
      return response.status(HttpStatus.OK).json({
        ...org.dataValues,
        // empresas: companies
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
  async createCompany(@Res() response: Response, @Body() newCompanyData: CreateCompanyDto) {
    try {
      const existOrganization = await this.businessService.findOneOrg(newCompanyData.id_organizacao);
      if (!existOrganization) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Organização informada é inválida.' })
      const newOrg = await this.businessService.createNewCompany(newCompanyData);
      return response.status(HttpStatus.CREATED).json({ message: 'Registro criado com sucesso.', empresa: { ...newOrg.dataValues } });
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

  @Put('empresas/:idOrg/:idCompany')
  async updateCompany(@Res() response: Response, @Param() params: {idOrg: string, idCompany: string}, @Body() newCompData: UpdateCompanyDtoDto) {
    const { idOrg, idCompany } = params;
    newCompData.id_organizacao = undefined
    if (!idOrg || !idCompany) return response.status(HttpStatus.BAD_REQUEST).json({ message: 'organização ou empresa não foram informados.' })
    const existOrg = await this.businessService.findOneCompanyForUpdate(+idOrg, +idCompany);
    if (!existOrg) return response.status(404).json({message: 'Empresa inválida.'})
    try {
      await this.businessService.updateCompany(+idOrg, newCompData);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Empresa atualizada', empresa: {...newCompData} })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete('empresas/:id')
  async removeCompany(@Res() response: Response, @Param('id') id: string) {
    const existCompany = await this.businessService.findOneCompany(+id);
    if (!existCompany) return response.status(404).json({message: 'Empresa inválida.'});
    try {
      await this.businessService.removeCompany(+id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  // Contratos
  @Post('contrato-novo')
  async createContract(@Res() response: Response, @Body() newContData: CreateContractDto) {
    try {
      const contract = await this.businessService.createNewContract(newContData);
      return response.status(HttpStatus.CREATED).json({message: 'Cadastrado com sucesso.', contrato: { ...contract.dataValues }});
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }
  @Get('contratos')
  findAllContract() {
    return this.businessService.findAllContract();
  }
  @Get('contratos/:id')
  async findOneContract(@Res() response: Response, @Param('id') id: string) {
    try {
      const contract = await this.businessService.findOneContract(+id);
      if (!contract) return response.status(HttpStatus.NOT_FOUND).json({ message: 'Contrato não encontrado' })
      return response.status(HttpStatus.OK).json(contract);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }
  @Put('contrato-atualizar/:id')
  async updateContract(@Res() response: Response, @Param('id') id: string, @Body() newContData: UpdateContractDto) {
    try {
      const existContract = await this.businessService.findOneContract(+id);
      if (!existContract) return response.status(HttpStatus.NOT_FOUND).json({ message: 'Falha ao atualizar contrato.' })
      await this.businessService.updateContract(+id, newContData);
      return response.status(HttpStatus.CREATED).json({message: 'Atualizado com sucesso.', contrato: newContData });
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }
  @Delete('contratos/:id')
  async removeContract(@Res() response: Response, @Param('id') id: string) {
    const existContract = await this.businessService.findOneContract(+id);
    if (!existContract) return response.status(404).json({message: 'Contrato inválido.'});
    try {
      await this.businessService.removeContract(+id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

}
