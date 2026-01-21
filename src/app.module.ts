import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from './database/knex.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, 
    }),
    KnexModule,
    AuthModule
  ],
})
export class AppModule {}
