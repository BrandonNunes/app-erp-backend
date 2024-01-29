import { PartialType } from '@nestjs/mapped-types';
import {CreateTipoProductDto} from "./create-tipo-product.dto";

export class UpdateTipoProductDto extends PartialType(CreateTipoProductDto) {}
