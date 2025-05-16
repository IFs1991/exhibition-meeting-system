import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { IdentityPlatformService } from '../../services/auth/identity-platform.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    IdentityPlatformService,
    {
      provide: 'IDENTITY_PLATFORM_CONFIG',
      useFactory: (configService: ConfigService) => ({
        projectId: configService.get('GCP_PROJECT_ID'),
        apiKey: configService.get('IDENTITY_PLATFORM_API_KEY'),
        serviceAccountKey: configService.get('IDENTITY_PLATFORM_SERVICE_ACCOUNT'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [UserService],
})
export class UserModule {}