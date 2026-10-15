import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  configureApp(app);
  app.enableShutdownHooks();

  const port = app.get(ConfigService).get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
