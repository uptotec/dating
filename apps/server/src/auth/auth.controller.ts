import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { jwtResponse } from './jwt.interface';
import { SignUpStep1Dto, signUpStep2Dto } from './dto/signUp.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './getUser.decorator';
import { User } from 'src/schema/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup/step1')
  async signUpStep1(@Body() credentials: SignUpStep1Dto): Promise<jwtResponse> {
    return this.authService.signUpStep1(credentials);
  }

  @Post('/signup/step2')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('photo'))
  async signUpStep2(
    @Body() profileInfo: signUpStep2Dto,
    @GetUser() user: User,
    @UploadedFile() profilePic: Express.MulterS3.File,
  ): Promise<void> {
    return this.authService.signUpStep2(profileInfo, profilePic, user);
  }

  @Post('/signin')
  async signIn(@Body() credentials: AuthCredentialsDto): Promise<jwtResponse> {
    return this.authService.signIn(credentials);
  }
}
