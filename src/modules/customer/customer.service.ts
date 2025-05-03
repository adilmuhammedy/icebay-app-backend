import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Franchise } from 'src/entities/franchise.entity';
import { Products } from 'src/entities/products.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { FranchiseStock } from '../../entities/franchise-stock.entity';
import { Customer } from '../../entities/customer.entity';
import { Repository } from 'typeorm';
import { SendOtpDto, SendOtpDtoResponse } from './dto/send-otp.dto';
import { VerifyOtpDto, VerifyOtpResponseDto } from './dto/verify-otp.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CustomerService {
  private otpStore: Map<string, string> = new Map();

  constructor(
    @InjectRepository(Franchise)
    private franchiseRepo: Repository<Franchise>,
    @InjectRepository(FranchiseStock)
    private franchiseStockRepo: Repository<FranchiseStock>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<SendOtpDtoResponse> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(dto.phone, otp);

    console.log(`Sending OTP ${otp} to ${dto.phone}`);

    // Find or create customer
    let customer = await this.customerRepo.findOne({
      where: { phone: dto.phone },
    });
    if (!customer) {
      customer = this.customerRepo.create({
        phone: dto.phone,
        name: dto.name || 'Customer',
      });
      await this.customerRepo.save(customer);
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    const storedOtp = this.otpStore.get(dto.phone);
    if (storedOtp && storedOtp === dto.otp) {
      this.otpStore.delete(dto.phone);

      // Find customer record to return with response
      const customer = await this.customerRepo.findOne({
        where: { phone: dto.phone },
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      return {
        authenticated: true,
        customerId: customer.id,
      };
    }

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
      relations: ['products'],
    });

    return stockEntries.map((entry) => ({
      ...entry.products,
      stock_quantity: entry.stock_quantity,
    }));
  }

  async createCart(dto: CreateCartDto) {
    const cart = this.orderRepo.create({
      customer_id: dto.customerId,
      franchise_id: dto.franchiseId,
      status: 'pending',
    });
    return await this.orderRepo.save(cart);
  }

  async getCart(orderId: string) {
    const cart = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async addItem(dto: AddItemDto) {
    const franchiseStock = await this.franchiseStockRepo.findOne({
      where: {
        product_id: dto.productId,
        franchise_id: dto.franchiseId,
      },
      relations: ['products'],
    });

    if (!franchiseStock) {
      throw new NotFoundException('Product not found at this franchise');
    }

    if (franchiseStock.stock_quantity < dto.quantity) {
      throw new UnauthorizedException('Not enough stock available');
    }

    const item = this.itemRepo.create({
      order_id: dto.orderId,
      product_id: dto.productId,
      quantity: dto.quantity,
      price: franchiseStock.products.price,
    });

    return await this.itemRepo.save(item);
  }

  async updateItem(itemId: string, dto: UpdateItemDto) {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['order', 'product'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.itemRepo.update(itemId, { quantity: dto.quantity });
    return { message: 'Item updated' };
  }

  async removeItem(itemId: string) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.itemRepo.delete(itemId);
    return { message: 'Item removed from cart' };
  }

  async checkoutOrder(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, status: 'pending' },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found or already processed');
    }

    order.status = 'placed';
    order.placed_at = new Date();

    return this.orderRepo.save(order);
  }
}
