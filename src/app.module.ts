import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import { enviroments } from './enviroments';
import { AdminsModule } from './admins/admins.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: enviroments[process.env.NODE_ENV] || '.env',
    load: [config],
    isGlobal: true,
   }),
    AdminsModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
