import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class ListCreatePedidoFormaPagamento {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo pedido deve ser informado.' })
    pedido: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo id_forma_pgto deve ser informado.' })
    id_forma_pgto: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo qtd_parcelas deve ser informado.' })
    qtd_parcelas: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo valor_parcela deve ser informado.' })
    valor_parcela: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor deve ser informado.' })
    @IsNumber({}, { message: 'O campo valor_total deve ser do tipo numero.' })
    valor_total: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo dia_vencimento deve ser informado.' })
    dia_vencimento_parcela: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string

}