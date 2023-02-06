import { Module } from '@nestjs/common';
import { UserController } from './logical/user/user.controller';
import { AuthModule } from './logical/auth/auth.module';
import { UserModule } from './logical/user/user.module';
import { CommodityModule } from './logical/commodity/commodity.module';
import { UploadController } from './logical/upload/upload.controller';
import { UploadModule } from './logical/upload/upload.module';

@Module({
  imports: [AuthModule, UserModule, CommodityModule, UploadModule],
  controllers: [UserController, UploadController],
  providers: [],
})
export class AppModule {}
