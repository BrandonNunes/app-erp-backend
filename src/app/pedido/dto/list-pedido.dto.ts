import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class ListCreatePedidoDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo pedido deve ser informado.' })
    pedido: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo cliente deve ser informado.' })
    cliente: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo data_pedido deve ser informado.' })
    data_pedido: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo observacao deve ser informado.' })
    observacao: string
    @ApiProperty()
    @IsNotEmpty({message: 'Um valor deve ser informado para o campo situacao'})
    situacao: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor_total deve ser informado.' })
   // @IsNumber({}, { message: 'O campo valor_total deve ser do tipo numero.' })
    valor_total: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor_desconto deve ser informado.' })
   // @IsNumber({}, { message: 'O campo valor_desconto deve ser do tipo numero.' })
    valor_desconto: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string
}