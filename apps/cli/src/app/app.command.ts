import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { AppService } from './app.service';

@Injectable()
export class AppCommand {
  constructor(private readonly appService: AppService) {}

  getData(): { message: string } {
    return { message: 'Welcome to cli!' };
  }

  @Command({ command: 'order-events:run' })
  async runEvents() {
    // await this.appService.loadOrderEvents();
    return;
  }

  @Command({ command: 'product-events:run-many' })
  async runProductEventsMany() {
    await this.appService.loadProductEventsMany();
    return;
  }

  @Command({ command: 'product-events:run <id>' })
  async runProductEvents(
    @Positional({
      type: 'string',
      name: 'id',
    })
    id: string
  ) {
    await this.appService.loadProductEvents(id);
    return;
  }
}
