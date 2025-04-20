import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import { StockRequestService } from './stock-request.service';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
// import { UpdateStockRequestDto } from './dto/update-stock-request.dto';

@Controller('stockRequest')
export class StockRequestController {
  constructor(private readonly stockRequestService: StockRequestService) {}

  @Post(':franchiseId')
  create(
    @Param('franchiseId') franchiseId: string,
    @Body() dto: CreateStockRequestDto,
  ) {
    return this.stockRequestService.create(franchiseId, dto);
  }

  @Get(':franchiseId')
  findAll(@Param('franchiseId') franchiseId: string) {
    return this.stockRequestService.findAll(franchiseId);
  }

  @Get(':stockRequestId')
  findOne(@Param('stockRequestId') stockRequestId: string) {
    return this.stockRequestService.findOne(stockRequestId);
  }

  @Put(':stockRequestId')
  update(
    @Param('stockRequestId') stockRequestId: string,
    @Body() dto: UpdateStockRequestDto,
  ) {
    return this.stockRequestService.update(stockRequestId, dto);
  }

  @Delete(':stockRequestId')
  remove(@Param('stockRequestId') stockRequestId: string) {
    return this.stockRequestService.remove(stockRequestId);
  }
}
