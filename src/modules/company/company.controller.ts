import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { Public } from '../../decorators/public.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthService } from '../auth/auth.service';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
@Roles(UserRole.COMPANY, UserRole.ADMIN)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new company' })
  @ApiResponse({ status: 201, description: 'Company registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  registerCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Post('franchise')
  @ApiOperation({ summary: 'Create a new franchise' })
  @ApiResponse({ status: 201, description: 'Franchise created successfully' })
  createFranchise(@Body() dto: CreateFranchiseDto, @Request() req) {
    // Set the company_id from the authenticated user
    dto.company_id = req.user.companyId;
    return this.companyService.createFranchise(dto);
  }

  @Get('franchise')
  @ApiOperation({ summary: 'Get all franchises for the company' })
  @ApiResponse({ status: 200, description: 'List of franchises' })
  fetchAllFranchise(@Request() req) {
    // If not admin, only show franchises for the logged-in company
    if (req.user.role === UserRole.COMPANY) {
      return this.companyService.fetchCompanyFranchises(req.user.companyId);
    }
    // For admins, show all franchises
    return this.companyService.fetchAllFranchise();
  }

  @Get('franchise/:franchiseId')
  @ApiOperation({ summary: 'Get a specific franchise' })
  @ApiResponse({ status: 200, description: 'Franchise details' })
  @ApiResponse({ status: 404, description: 'Franchise not found' })
  fetchOneFranchise(@Param('franchiseId') id: string, @Request() req) {
    return this.companyService.fetchFranchise(id, req.user);
  }

  @Put('franchise/:franchiseId')
  @ApiOperation({ summary: 'Update franchise details' })
  @ApiResponse({ status: 200, description: 'Franchise updated successfully' })
  @ApiResponse({ status: 404, description: 'Franchise not found' })
  updateFranchiseDetails(
    @Param('franchiseId') id: string,
    @Body() dto: UpdateFranchiseDto,
    @Request() req,
  ) {
    return this.companyService.updateFranchise(id, dto, req.user);
  }

  @Delete('franchise/:franchiseId')
  @ApiOperation({ summary: 'Remove a franchise' })
  @ApiResponse({ status: 200, description: 'Franchise removed successfully' })
  @ApiResponse({ status: 404, description: 'Franchise not found' })
  removeFranchise(@Param('franchiseId') id: string, @Request() req) {
    return this.companyService.removeFranchise(id, req.user);
  }

  @Post('product')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() dto: CreateProductDto, @Request() req) {
    // For company users, associate product with their company
    if (req.user.role === UserRole.COMPANY) {
      dto.company_id = req.user.companyId;
    }
    return this.companyService.createProduct(dto);
  }

  @Get('product')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  fetchAllProducts(@Request() req) {
    // If company user, only show products for their company
    if (req.user.role === UserRole.COMPANY) {
      return this.companyService.fetchCompanyProducts(req.user.companyId);
    }
    // For admins, show all products
    return this.companyService.fetchAllProducts();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get a specific product' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  fetchOneProduct(@Param('productId') productId: string, @Request() req) {
    return this.companyService.fetchOneProduct(productId, req.user);
  }

  @Put('product/:productId')
  @ApiOperation({ summary: 'Update product details' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateProduct(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
    @Request() req,
  ) {
    return this.companyService.updateProduct(productId, dto, req.user);
  }

  @Delete('product/:productId')
  @ApiOperation({ summary: 'Remove a product' })
  @ApiResponse({ status: 200, description: 'Product removed successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('productId') productId: string, @Request() req) {
    return this.companyService.removeProduct(productId, req.user);
  }
}
