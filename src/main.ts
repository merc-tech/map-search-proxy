import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { defaultTo } from 'lodash';

async function bootstrap() {
  const logger = new Logger
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const port = defaultTo(process.env.PORT, 3000);
  await app.listen(port , ()=>{
    logger.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
