import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Franchise } from 'src/entities/franchise.entity';
import { Product } from 'src/entities/product.entity';
import { FranchiseStock } from '../entities/franchise-stock.entity';
import { Repository } from 'typeorm';
import { SendOtpDto, SendOtpDtoResponse } from './dto/send-otp.dto';
import { VerifyOtpDto, VerifyOtpResponseDto } from './dto/verify-otp.dto';

@Injectable()
export class CustomerService {
  private otpStore: Map<string, string> = new Map(); // replace with Redis in production
  constructor(
    @InjectRepository(Franchise)
    private franchiseRepo: Repository<Franchise>,

    @InjectRepository(FranchiseStock)
    private franchiseStockRepo: Repository<FranchiseStock>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}
  async sendOtp(dto: SendOtpDto): Promise<SendOtpDtoResponse> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(dto.phone, otp);

    // In real world: integrate with SMS API here
    console.log(`Sending OTP ${otp} to ${dto.phone}`);
    await Promise.resolve();
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    const storedOtp = this.otpStore.get(dto.phone);
    if (storedOtp && storedOtp === dto.otp) {
      this.otpStore.delete(dto.phone); // invalidate after use
      return { authenticated: true };
    }
    await Promise.resolve();
    return { authenticated: false };
  }

  async getFranchiseByQrCode(qrCode: string) {
    const franchise = await this.franchiseRepo.findOne({
      where: { qr_code: qrCode },
    });

    if (!franchise) {
      throw new NotFoundException('Franchise not found');
    }

    return franchise;
  }

  async getProductsByFranchise(franchiseId: string) {
    const stockEntries = await this.franchiseStockRepo.find({
      where: { franchise_id: franchiseId },
      relations: ['product'],
    });

    const products = stockEntries.map((entry) => ({
      ...entry.product,
      stock_quantity: entry.stock_quantity,
    }));

    return products;
  }
}
