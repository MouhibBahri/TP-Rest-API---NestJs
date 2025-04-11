import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { UserEntity } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SkipAuth } from '../decorators/skip-auth.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @SkipAuth()
  @ApiOperation({ summary: 'Sign up a new user' })
  signUp(@Body() signupDto: SignUpDto): Promise<UserEntity> {
    return this.authService.signUp(signupDto);
  }

  @Post('login')
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with existing account' })
  login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }
}
