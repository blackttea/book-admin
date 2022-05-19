import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './logical/user/user.controller';
import { AuthModule } from './logical/auth/auth.module';
import { UserModule } from './logical/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
