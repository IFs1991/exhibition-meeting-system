import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { UnifiedConfigService } from '../../config/unified-config.service';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [UnifiedConfigService],
      useFactory: (configService: UnifiedConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: `${configService.jwtExpiresIn}s` },
      }),
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserRepository,
    UserService,
    AuthService,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}