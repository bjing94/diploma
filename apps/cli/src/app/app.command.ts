import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { AppService } from './app.service';

@Injectable()
export class AppCommand {
  constructor(private readonly appService: AppService) {}

  getData(): { message: string } {
    return { message: 'Welcome to cli!' };
  }

  @Command({ command: 'order-events:run' })
  async runEvents() {
    this.appService.loadOrderEvents();
  }
}
