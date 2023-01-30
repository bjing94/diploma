import { Controller, Get } from '@nestjs/common';

import { AppCommand } from './app.command';

@Controller()
export class AppController {
  constructor(private readonly appService: AppCommand) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
