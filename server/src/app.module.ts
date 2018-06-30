import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReaderModule } from './src/modules/reader/reader.module';
import { ReaderService } from './src/modules/reader/reader.service';
import { ReaderController } from "./src/modules/reader/reader.controller"

@Module({
  imports: [ReaderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
