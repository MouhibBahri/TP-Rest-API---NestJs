import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up.dto';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto): Promise<UserEntity> {
    const { email, username, password } = data;

    // Check if username and email are unique
    const existingEmail = await this.userRepository.findOneBy({ email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const existingUsername = await this.userRepository.findOneBy({ username });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      username,
      email,
      salt,
      password: hashedPassword,
      // The role attribute will be set to the default value: USER
    });

    const savedUser: UserEntity = await this.userRepository.save(newUser);

    // const { password:_, salt:__, ...result } = savedUser;
    // returning all data for testing purposes only
    return savedUser;
  }
  /*
  // No longer needed as it is replaced by passport local strategy and local auth guard
  async login(data: LoginDto): Promise<UserEntity> {
    const { usernameOrEmail, password } = data;
    let user = await this.userRepository.findOneBy({
      username: usernameOrEmail,
    });
    if (!user) {
      await this.userRepository.findOneBy({ email: usernameOrEmail });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }
    return user;
  }*/

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    let user = await this.userRepository.findOneBy({
      username: usernameOrEmail,
    });
    if (!user) {
      await this.userRepository.findOneBy({ email: usernameOrEmail });
    }
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
