// src/logical/user/user.controller.ts
import { Controller, Post, Body, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { RegisterInfoDTO, LoginDTO } from './user.dto';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';


@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('user') // 添加 接口标签 装饰器
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}
  @Post('find-one')
  findOne(@Body() body: any) {
    return this.usersService.findOne(body.username);
  }

  @Post('info')
  getInfo(@Body() body: any) {
    return this.usersService.getInfo(body.username);
  }
  // JWT验证 - Step 1: 用户请求登录
  @Post('login')
  @ApiBody({
    description: '用户登录',
    type: LoginDTO,
  })
  async login(@Body() loginParmas: LoginDTO) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(
      loginParmas.username,
      loginParmas.password,
    );
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @Post('register')
  async register(@Body() body) {
    return await this.usersService.register(body);
  }
}
