import { Module } from '@nestjs/common';
import AppCommandController from './app.command.controller';

@Module({
  imports: [],
  controllers: [AppCommandController],
  providers: [],
})
export class AppModule {}
