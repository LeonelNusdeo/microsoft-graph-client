import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicrosoftGraphService } from './microsoft-graph/microsoft-graph.service';
import { ConfigModule } from '@nestjs/config';
import { MicrosoftGraphController } from './microsoft-graph/microsoft-graph.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, MicrosoftGraphController],
  providers: [AppService, MicrosoftGraphService],
})
export class AppModule {}
