import {Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put} from '@nestjs/common';
import { OrganizacaoService } from './organizacao.service';
import {Response} from "express";
import {CreateOrganizacaoDto} from "./dto/create-organizacao.dto";
import {UpdateOrganizacaoDto} from "./dto/update-organizacao.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Organização')
@Controller('organizacao')
export class OrganizacaoController {
  constructor(private readonly organizacaoService: OrganizacaoService) {}

  @Post()
  async createOrg(@Res() response: Response, @Body() newOrgdata: CreateOrganizacaoDto) {
    try {
      const newOrg = await this.organizacaoService.createNewOrg(newOrgdata);
      return response.status(HttpStatus.CREATED).json({ message: 'Registro criado com sucesso.', organizacao: { ...newOrg.dataValues } });
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor.', erro })
    }
  }

  @Get()
  async findAllOrganization(@Res() response: Response) {
    try{
      const orgs = await this.organizacaoService.findAllOrganization();
      return response.status(HttpStatus.OK).json(orgs);
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro});
    }

  }

  @Get(':id')
  async findOneOrg(@Res() response: Response, @Param('id') id: string) {
    try {
      const org = await this.organizacaoService.findOneOrg(+id);
      if (!org) return response.status(HttpStatus.NOT_FOUND).json({message: 'Organização não encontrada.'});
      // const companies = await this.organizacaoService.findAllCompany({organizacao: id});
      return response.status(HttpStatus.OK).json({
        ...org.dataValues,
        // empresas: companies
      });
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno de servidor', erro })
    }
  }

  @Put(':id')
  async updateOrg(@Res() response: Response, @Param('id') id: string, @Body() newOrgData: UpdateOrganizacaoDto) {
    const existOrg = await this.organizacaoService.findOneOrg(+id);
    if (!existOrg) return response.status(404).json({message: 'Organização inválida.'})
    try {
      await this.organizacaoService.updateOrg(+id, newOrgData);
      return response.status(HttpStatus.ACCEPTED).json({ message: 'Organização atualizada', newOrgData })
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }

  @Delete(':id')
  async removeOrg(@Res() response: Response, @Param('id') id: string) {
    const existOrg = await this.organizacaoService.findOneOrg(+id);
    if (!existOrg) return response.status(404).json({message: 'Organização inválida.'});
    try {
      await this.organizacaoService.removeOrg(+id);
      return response.status(HttpStatus.ACCEPTED).json({message: 'Registro removido com sucesso'})
    }catch (erro) {
      console.log(erro);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Erro interno de servidor.', erro})
    }
  }
}
