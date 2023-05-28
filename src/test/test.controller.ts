import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  testRoute(): string {
    return 'Test successful';
  }
}
