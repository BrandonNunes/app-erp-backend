import {Controller, Get, HttpException, HttpStatus, Param, Res} from '@nestjs/common';
import { AppService } from './app.service';
import axios, {AxiosResponse} from "axios";
import { Response } from 'express'


interface ReturnBrasilAbertoCepProps {
  "meta": {
    "currentPage": number,
    "itemsPerPage": number,
    "totalOfItems": number,
    "totalOfPages": number
  },
  "result": {
    "street": string,
    "complement": string,
    "district": string,
    "districtId": number,
    "city": string,
    "cityId": number,
    "ibgeId": number,
    "state": string,
    "stateShortname": string,
    "zipcode": string
  }
}
const brasilAbertoUrl = 'https://brasilaberto.com/api/v1/zipcode/'
@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
     ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cep/:cep')
  async searchCep(@Res() response: Response, @Param('cep') cep: string) {
    if (!cep) return new HttpException('Um cep deve ser informado', 400, {description: 'Não foi encontrado um cep na requisição.'})
    try {
      cep.replace(/[\D]+/g,'')
      const resp: AxiosResponse<ReturnBrasilAbertoCepProps> = await axios.get(brasilAbertoUrl+cep)
      const result = {
        cep: resp.data.result.zipcode,
        logradouro: resp.data.result.street,
        complemento: resp.data.result.complement,
        bairro: resp.data.result.district,
        cidade: resp.data.result.city,
        uf: resp.data.result.state,
        ufSigla: resp.data.result.stateShortname
      }
      return response.status(HttpStatus.OK).json(result)
    }catch (erro) {
      return response.status(HttpStatus.NOT_FOUND).json({message: 'CEP não encontrado.'})
    }
  }
}
