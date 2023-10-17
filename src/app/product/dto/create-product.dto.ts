import {

    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreateProductDto {

   @IsNotEmpty({ message: 'Um código de produto deve ser fornecido.' })
    produto: string;

    @IsNotEmpty({ message: 'Um empresa válida deve ser fornecida.' })
    empresa: number;

    @IsNotEmpty({ message: 'Uma descrição válida deve ser fornecida.' })
    descricao: string;

    @IsNotEmpty({ message: 'Uma grupo válido deve ser fornecido.' })
    @IsNumber()
    grupo: number;

    @IsNotEmpty({ message: 'Uma medida válida deve ser fornecida.' })
    @IsNumber()
    medida_base: number;

    @IsNotEmpty({ message: 'Um tipo válido deve ser fornecido.' })
    @IsNumber()
    tipo_item: number;

    @IsNotEmpty({ message: 'Um valor mínimo deve ser fornecida.' })
    @IsNumber()
    venda_minima: number;

    @IsNotEmpty({ message: 'Um valor mínimo padrão ser fornecida.' })
    @IsNumber()
    venda_padrao: number;

    @IsNotEmpty({ message: 'Um valor máximo deve ser fornecida.' })
    @IsNumber()
    venda_maxima: number;

}
