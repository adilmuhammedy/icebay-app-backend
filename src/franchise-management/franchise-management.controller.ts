import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FranchiseManagementService } from './franchise-management.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';

@Controller('franchise-management')
export class FranchiseManagementController {
  constructor(
    private readonly franchiseManagementService: FranchiseManagementService,
  ) {}

  @Post()
  create(@Body() dto: CreateFranchiseDto) {
    return this.franchiseManagementService.create(dto);
  }

  @Get()
  findAll() {
    return this.franchiseManagementService.findAll();
  }

  @Get(':franchiseId')
  findOne(@Param('franchiseId') id: string) {
    return this.franchiseManagementService.findOne(id);
  }

  @Put(':franchiseId')
  update(@Param('franchiseId') id: string, @Body() dto: UpdateFranchiseDto) {
    return this.franchiseManagementService.update(id, dto);
  }

  @Delete(':franchiseId')
  remove(@Param('franchiseId') id: string) {
    return this.franchiseManagementService.remove(id);
  }
}
