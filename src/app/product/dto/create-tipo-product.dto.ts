import {

    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreateProductDto {

   @IsNotEmpty({ message: 'Um código de produto deve ser fornecido.' })
   cod_produto: string;

    @IsNotEmpty({ message: 'Uma empresa válida deve ser fornecida.' })
    id_empresa: number;

    @IsNotEmpty({ message: 'Uma descrição válida deve ser fornecida.' })
    descricao: string;

    @IsNotEmpty({ message: 'Uma grupo válido deve ser fornecido.' })
    @IsNumber()
    id_grupo: number;

    @IsNotEmpty({ message: 'Um valor mínimo deve ser fornecida.' })
    @IsNumber()
    valor_minimo: number;

    @IsNotEmpty({ message: 'Um valor mínimo padrão ser fornecida.' })
    @IsNumber()
    valor_padrao: number;

    @IsNotEmpty({ message: 'Um valor máximo deve ser fornecida.' })
    @IsNumber()
    valor_maximo: number;

}
