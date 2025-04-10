import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { UserEntity } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  signUp(@Body() signupDto: SignUpDto): Promise<UserEntity> {
    return this.authService.signUp(signupDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with existing account' })
  login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @UseGuards(LocalAuthGuard)
  async logout(@Request() req) {
    return req.logout();
  }
}
