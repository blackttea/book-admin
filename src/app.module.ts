import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './logical/user/user.controller';
import { AuthModule } from './logical/auth/auth.module';
import { UserModule } from './logical/user/user.module';
import { CommodityModule } from './logical/commodity/commodity.module';

@Module({
  imports: [AuthModule, UserModule, CommodityModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
