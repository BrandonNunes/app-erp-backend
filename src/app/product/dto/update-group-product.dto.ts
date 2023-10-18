import { PartialType } from '@nestjs/mapped-types';
import {CreateGroupProductDto} from "./create-group-product.dto";

export class UpdateGroupProductDto extends PartialType(CreateGroupProductDto) {}
