import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsNotEmpty, IsNumber, ValidateIf, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ListCreatePedidoDto} from "./list-pedido.dto";
import {ListCreatePedidoItemDto} from "./list-item-pedido.dto";
import {ListCreatePedidoItemAtributoDto} from "./list-item-atributo.dto";
import {ListCreatePedidoFormaPagamento} from "./list-forma-pagamento-pedido.dto";

export class CreatePedidoDto {
    @ApiProperty()
    @IsNotEmpty({message: 'Uma empresa deve ser informada'})
    @IsNumber({}, {message: 'Empresa deve ser um ID do tipo numero'})
    empresa: number;
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo pedido', isArray: true, type: ListCreatePedidoDto})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'listPedido deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreatePedidoDto)
    listPedido: ListCreatePedidoDto[]
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo usuário', isArray: true, type: ListCreatePedidoItemDto})
    @ValidateNested({ each: true })
    @ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreatePedidoItemDto)
    listItem: ListCreatePedidoItemDto[]
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo pedido', isArray: true, type: ListCreatePedidoItemAtributoDto})
    @ValidateNested({ each: true })
    //@ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreatePedidoItemAtributoDto)
    listItemAtributo: ListCreatePedidoItemAtributoDto[]
    @ApiProperty({description: 'Lista de objetos com as propriedades do novo pedido', isArray: true, type: ListCreatePedidoFormaPagamento})
    @ValidateNested({ each: true })
    //@ArrayMinSize(1, {message: 'list deve conter ao menos 1(um) elemento.'})
    @Type(() => ListCreatePedidoFormaPagamento)
    listFormaPgto: ListCreatePedidoFormaPagamento[]
    @ApiProperty()
    @ValidateIf(value => value.usuario === undefined)
    @IsNotEmpty({message: 'Um usuario deve ser informado'})
    usuario: string;
}
