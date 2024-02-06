import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNotEmpty, IsNumber, ValidateIf} from "class-validator";

export class ListCreatePedidoItemAtributoDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo pedido deve ser informado.' })
    pedido: number
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo produto deve ser informado.' })
    produto: string
    @ApiProperty()
    @ValidateIf(value => value.id_produtos_atributos === undefined)
    @IsNotEmpty({ message: 'O campo id_produtos_atributos deve ser informado.' })
    id_produtos_atributos: number | null;
    @ApiProperty()
    @ValidateIf(value => value.id_produtos_atributos === undefined)
    @IsNotEmpty({ message: 'O campo id_produtos_atributos deve ser informado.' })
    id_grupos_atributos: number | null;
    @ApiProperty()
    @IsNotEmpty({ message: 'Um valor para valor deve ser informado.' })
    valor: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    CodigoExterno: string
    @ApiProperty()
    @IsNotEmpty({ message: 'O campo CodigoExterno deve ser informado.' })
    @IsBoolean({message: 'O campo obrigatorio deve ser do tipo booleano.'})
    obrigatorio: boolean
}