import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user with the given email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create(registerDto);
    await this.userRepository.save(user);

    // Remove password from response
    const { password, ...result } = user;

    // Generate token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user: result,
      access_token: this.jwtService.sign(payload),
    };
  }

  // Update the login method to include company_id in the payload
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Include company_id in the payload
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      company_id: user.company_id,
    };

    const { password, ...result } = user;

    return {
      user: result,
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateOtpUser(phone: string): Promise<any> {
    // For OTP-based user (customers), we'll create a JWT without password authentication
    // This assumes the OTP verification has already happened
    const payload = { phone, role: 'customer' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateCustomerToken(
    phone: string,
    customerId: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      phone,
      sub: customerId,
      role: UserRole.CUSTOMER,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
