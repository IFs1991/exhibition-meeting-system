import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Profile } from '../../entities/profile.entity';
import { UnifiedConfigService } from '../../config/unified-config.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    JwtModule.registerAsync({
      inject: [UnifiedConfigService],
      useFactory: (configService: UnifiedConfigService) => ({
        secret: configService.supabaseJwtSecret,
        signOptions: { expiresIn: `${configService.jwtExpiresIn}s` },
      }),
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}