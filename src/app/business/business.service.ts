import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {OrganizationModel} from "./entities/organization.entity";
import { EmpresaModel } from "./entities/company.entity";
import {CreateOrganizationDto} from "./dto/create-organization.dto";
import {UpdateOrganizationDto} from "./dto/update-organization.dto";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDtoDto} from "./dto/update-company.dto";
import {QueryParamsBusiness} from "./business.controller";
import {Sequelize} from "sequelize-typescript";
import {CreateContractDto} from "./dto/create-contract.dto";
import {ContractModel} from "./entities/contract.entity";
import {UpdateContractDto} from "./dto/update-contract.dto";
import {Op} from "sequelize";
import {UsuarioEmpresaModel} from "../usuario/entities/usuario_empresa.entity";
import {Users} from "../usuario/entities/usuario.entity";

@Injectable()
export class BusinessService {

  constructor(
      @InjectModel(OrganizationModel) private organizationModel: typeof OrganizationModel,
      @InjectModel(EmpresaModel) private empresaModel: typeof EmpresaModel,
      @InjectModel(ContractModel) private contractModel: typeof ContractModel,
      private sequelize: Sequelize,
  ) {}
  createNewOrg(newOragization: CreateOrganizationDto) {
    return this.organizationModel.create(newOragization as any);
  }

  async findAllOrganization() {
    return this.organizationModel.findAll();
  }

  findOneOrg(id: number) {
    return this.organizationModel.findByPk(id, {include: [EmpresaModel, ContractModel]});
  }

  updateOrg(id: number, orgData: UpdateOrganizationDto) {
    return this.organizationModel.update(orgData, { where: {id} });
  }

  removeOrg(id: number) {
    return this.organizationModel.destroy({ where: {id} });
  }
  /**--EMPRESAS----*/
  async createNewCompany(newCompany: CreateCompanyDto) {
      // const keys = Object.keys(newCompany).join(',')
      // const values = Object.values(newCompany).map(value => {
      //   if (typeof value === 'string') return `'${value}'`
      //   return value
      // })
      // const autoID = () => Math.floor(Math.random() * 999999);
      //
      // return await this.sequelize.query(
      //     `INSERT INTO empresas(empresa,${keys})
      //           VALUES(${autoID()}, ${values})`
      // );
    return this.empresaModel.create(newCompany as any);
  }

  findAllCompany(queryParams: QueryParamsBusiness) {
    if (queryParams.organizacao) {
      return this.empresaModel.findAll({
        where: { id_organizacao: queryParams.organizacao }
      });
    }
    return this.empresaModel.findAll();
  }

  findOneCompany(id: number) {
    return this.empresaModel.findOne({
      where: {
        id
      }, include: [ {
        model: Users,
        attributes: {
          exclude: ['senha'],
        },
      },]
    });
  }
  findOneCompanyForUpdate(idOrg: number, idCompany: number) {
    return this.empresaModel.findOne({
      where: {
        id: idCompany,
        [Op.and]: {
          id_organizacao: idOrg
        }
      }
    });
  }

  updateCompany(id: number, orgData: UpdateCompanyDtoDto) {
    return this.empresaModel.update(orgData, { where: { id } });
  }

  removeCompany(id: number) {
    return this.empresaModel.destroy({ where: { id } });
  }

  // contratos

  createNewContract(newContract: CreateContractDto) {
    return this.contractModel.create(newContract as any);
  }
  findAllContract() {
    return this.contractModel.findAll();
  }
  findOneContract(id: number) {
    return this.contractModel.findByPk(id);
  }

  updateContract(id: number, newContract: UpdateContractDto) {
    return this.contractModel.update(newContract as any, { where: { id } });
  }

  removeContract(id: number) {
    return this.contractModel.destroy({ where: { id } });
  }
}
