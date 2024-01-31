import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {OrganizacaoModule} from "./app/organizacao/organizacao.module";
import {LojaModel} from "./app/loja/entities/loja.entity";
import {LojaModule} from "./app/loja/loja.module";
import {UsuarioModule} from "./app/usuario/usuario.module";

async function bootstrap() {
  // config();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: {
    origin: '*',
      preflightContinue: true
    } });
  const config = new DocumentBuilder()
      .setTitle('Endpoints')
      .setDescription('API app POS')
      .setVersion('1.0')
      .addServer('http://localhost:5000/app')
      // .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config, {include: [
      OrganizacaoModule,
      LojaModule,
      UsuarioModule
    ]});
  SwaggerModule.setup('docs', app, document);
  app.setGlobalPrefix('app', { exclude: ['docs'] });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    console.log('server running on port: ' + port);
  });
}
bootstrap();
