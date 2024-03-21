import { Injectable} from '@nestjs/common';





@Injectable()
export class AppService {

  getHello(): string {
    return 'APP ON!';
  }

  validDate(date: string) 
{ 
    var matches: any = /(\d{4})[-.\/](\d{2})[-.\/](\d{2})/.exec(date); 
    var matches2 = /(\d{4})[-.\/](\d{2})[-.\/](\d{2})/.test(date); 
    if (!matches) { 
        return false; 
    } 
    if (!matches2) return false
    var dia = matches[3]; 
    var mes = matches[2] - 1; 
    var ano = matches[1]; 
    var data = new Date(ano, mes, dia); 
    return data.getDate() == dia && data.getMonth() == mes && data.getFullYear() == ano; 
} 

}
