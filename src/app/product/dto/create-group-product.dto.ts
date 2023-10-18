import {

    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreateGroupProductDto {

    @IsNotEmpty({ message: 'Uma empresa válida deve ser fornecida.' })
    @IsNumber()
    id_empresa: number;

    @IsNotEmpty({ message: 'Uma descrição válida deve ser fornecida.' })
    descricao: string;

}
