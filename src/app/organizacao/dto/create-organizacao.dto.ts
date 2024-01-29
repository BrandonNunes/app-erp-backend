import {
    IsNotEmpty, IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizacaoDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Uma razao social deve ser informada.'})
    razao_social: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Um nome fantasia deve ser informado.'})
    nome_fantasia: string;

    @ApiProperty({required: false})
    @IsOptional()
    cpf_cnpj: string;

    @ApiProperty({required: false})
    @IsOptional()
    logo: string;

}
