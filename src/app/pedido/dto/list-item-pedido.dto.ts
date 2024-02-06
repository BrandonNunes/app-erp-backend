import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class ListCreatePedidoItemDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo pedido deve ser informado.' })
    pedido: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo produto deve ser informado.' })
    produto: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo quantidade deve ser informado.' })
    quantidade: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor_unitario deve ser informado.' })
    @IsNumber({}, { message: 'O campo valor_unitario deve ser do tipo numero.' })
    valor_unitario: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor_total deve ser informado.' })
    @IsNumber({}, { message: 'O campo valor_total deve ser do tipo numero.' })
    valor_total: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor_desconto deve ser informado.' })
    @IsNumber({}, { message: 'O campo valor_desconto deve ser do tipo numero.' })
    valor_desconto: number
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para perc_desconto deve ser informado.' })
    @IsNumber({}, { message: 'O campo perc_desconto deve ser do tipo numero.' })
    perc_desconto: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string
}