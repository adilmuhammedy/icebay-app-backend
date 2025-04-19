import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Franchise } from 'src/entities/franchise.entity';
import { Products } from 'src/entities/products.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { FranchiseStock } from '../../entities/franchise-stock.entity';
import { Repository } from 'typeorm';
import { SendOtpDto, SendOtpDtoResponse } from './dto/send-otp.dto';
import { VerifyOtpDto, VerifyOtpResponseDto } from './dto/verify-otp.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
@Injectable()
export class CustomerService {
  private otpStore: Map<string, string> = new Map(); // replace with Redis in production
  constructor(
    @InjectRepository(Franchise)
    private franchiseRepo: Repository<Franchise>,

    @InjectRepository(FranchiseStock)
    private franchiseStockRepo: Repository<FranchiseStock>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,

    @InjectRepository(Products)
    private productRepo: Repository<Products>,
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
      ...entry.products,
      stock_quantity: entry.stock_quantity,
    }));

    return products;
  }

  async createCart(dto: CreateCartDto) {
    const cart = this.orderRepo.create({ customer_id: dto.customerId });
    return await this.orderRepo.save(cart);
  }

  async getCart(orderId: string) {
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
  }

  async addItem(dto: AddItemDto) {
    const product = await this.franchiseStockRepo.findOneBy({
      id: dto.productId,
    });
    if (!product) throw new NotFoundException('Product not found');

    const item = this.itemRepo.create({
      order_id: dto.orderId,
      product_id: dto.productId,
      quantity: dto.quantity,
    });

    return await this.itemRepo.save(item);
  }

  async updateItem(itemId: string, dto: UpdateItemDto) {
    await this.itemRepo.update(itemId, { quantity: dto.quantity });
    return { message: 'Item updated' };
  }

  async removeItem(itemId: string) {
    await this.itemRepo.delete(itemId);
    return { message: 'Item removed from cart' };
  }

  async checkoutOrder(orderId: string) {
    // Find the order by ID with its items
    const order = await this.orderRepo.findOne({
      where: { id: orderId, status: 'pending' },
      relations: ['items'],
    });

    if (!order) {
      throw new Error('Order not found or already processed.');
    }

    // Update the order status to 'placed'
    order.status = 'placed';

    // Process any other logic like inventory or payment (if necessary)
    // For example, deduct the inventory based on the order items

    // do this on order approving by franchise staff at franchise dashboard
    // for (const item of order.items) {
    //   await this.franchiseStockRepo.decrement(
    //     { id: item.product_id },
    //     'stock_quantity',
    //     item.quantity,
    //   );
    // }

    // Save the updated order
    return this.orderRepo.save(order);
  }
}
