import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SetupApp(app);
  await app.listen(3000);
}
bootstrap();
