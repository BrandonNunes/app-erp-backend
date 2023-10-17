import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {OrganizationModel} from "./entities/organizacao.entity";
import { EmpresaModel } from "./entities/company.entity";
import {CreateOrganizationDto} from "./dto/create-organization.dto";
import {UpdateOrganizationDto} from "./dto/update-organization.dto";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDtoDto} from "./dto/update-company.dto";
import {QueryParamsBusiness} from "./business.controller";
import {Sequelize} from "sequelize-typescript";

@Injectable()
export class BusinessService {

  constructor(
      @InjectModel(OrganizationModel) private organizationModel: typeof OrganizationModel,
      @InjectModel(EmpresaModel) private empresaModel: typeof EmpresaModel,
      private sequelize: Sequelize,
  ) {}
  createNewOrg(newOragization: CreateOrganizationDto) {
    return this.organizationModel.create(newOragization as any);
  }

  async findAllOrganization() {
    return this.organizationModel.findAll();
  }

  findOneOrg(id: number) {
    return this.organizationModel.findByPk(id, {include: [EmpresaModel]});
  }

  updateOrg(id: number, orgData: UpdateOrganizationDto) {
    return this.organizationModel.update(orgData, { where: {id} });
  }

  removeOrg(id: number) {
    return this.organizationModel.destroy({ where: {id} });
  }
  /**--EMPRESAS----*/
  async createNewCompany(newCompany: CreateCompanyDto) {
      const keys = Object.keys(newCompany).join(',')
      const values = Object.values(newCompany).map(value => {
        if (typeof value === 'string') return `'${value}'`
        return value
      })
      const autoID = () => Math.floor(Math.random() * 999999);

      return await this.sequelize.query(
          `INSERT INTO empresas(empresa,${keys}) 
                VALUES(${autoID()}, ${values})`
      );
   // return this.empresaModel.create(newCompany as any);
  }

  findAllCompany(queryParams: QueryParamsBusiness) {
    if (queryParams.organizacao) {
      return this.empresaModel.findAll({
        where: { idOrganizacao: queryParams.organizacao }
      });
    }
    return this.empresaModel.findAll();
  }

  findOneCompany(id: number) {
    return this.empresaModel.findByPk(id);
  }

  updateCompany(id: number, orgData: UpdateCompanyDtoDto) {
    return this.empresaModel.update(orgData, { where: { empresa: id} });
  }

  removeCompany(id: number) {
    return this.empresaModel.destroy({ where: { empresa: id } });
  }
}
