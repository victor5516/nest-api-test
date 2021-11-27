import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('JooycarTest')
  .setDescription('Admins API')
  .setVersion('1.0')
  .build();
  app.enableCors();
  app.setGlobalPrefix('v1');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);
  await app.listen(process.env.PORT || 3000);


}
bootstrap();
