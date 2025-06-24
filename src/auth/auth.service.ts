import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

// common funcationalities

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(payload: any): Promise<User> {
    return this.findById(payload.sub);
  }

// user functionalities

  async registerUser(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password, name } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser);
    const { password: _, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  // admin functionalities

  async registerAdmin(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password, name } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const savedAdmin = await this.userRepository.save(admin);
    const token = this.generateToken(savedAdmin);
    const { password: _, ...adminWithoutPassword } = savedAdmin;

    return {
      user: adminWithoutPassword,
      token,
    };
  }

  async loginAdmin(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;
  
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
  
    const token = this.generateToken(user);
    const { password: _, ...adminWithoutPassword } = user;
  
    return {
      user: adminWithoutPassword,
      token,
    };
  }
  

  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<Partial<User>> {
    const user = await this.findById(id);
    user.isActive = isActive;
  
    const updatedUser = await this.userRepository.save(user);
  
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
  
}
