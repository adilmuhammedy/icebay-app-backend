// src/franchise/dto/update-franchise.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFranchiseDto } from './create-franchise.dto';

export class UpdateFranchiseDto extends PartialType(CreateFranchiseDto) {}
