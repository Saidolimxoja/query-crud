import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KnexService } from 'src/database/knex.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private knex: KnexService, 
    private jwtService: JwtService, 
  ) {}


  //for REGISTER
  async register(dto: RegisterDto) {
    const existingUser = await this.knex
      .knexInstance('customers')
      .where('email', dto.email)
      .first();

    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const [user] = await this.knex
      .knexInstance('customers')
      .insert({
        email: dto.email,
        password_hash: hashedPassword,
        first_name: dto.firstName,
        last_name: dto.lastName ,
        phone_number: dto.phoneNumber || null,
        address: dto.address || null,
        city: dto.city || null,
        postal_code: dto.postalCode || null,
        country: dto.country || null,
      })
      .returning(['customer_id', 'email','first_name', 'last_name', 'phone_number', 'address', 'city', 'postal_code', 'country']);

    return user;
  }


  // for проверки логина и пароля
  async validateUser(req: any) {
    const user = await this.knex
      .knexInstance('customers')
      .where({ email: req.email })
      .first();

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(
      req.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.customer_id, email: user.email };
    return {
      user: {
      customer_id: user.customer_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      address: user.address,
      city: user.city,
      postal_code: user.postal_code,
      country: user.country,  
    },
      access_token: this.jwtService.sign(payload)
    };
  }

  
}