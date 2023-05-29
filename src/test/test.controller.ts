import { Controller, Get } from '@nestjs/common';

console.log('PASSWORD:', process.env.PG_PASSWORD);

@Controller('test')
export class TestController {
  @Get()
  testRoute(): string {
    return 'Test successful';
  }
}
