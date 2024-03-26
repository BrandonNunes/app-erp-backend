import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {OrganizacaoModule} from "./app/organizacao/organizacao.module";
import {LojaModel} from "./app/loja/entities/loja.entity";
import {LojaModule} from "./app/loja/loja.module";
import {UsuarioModule} from "./app/usuario/usuario.module";
import {AuthModule} from "./app/auth/auth.module";
import * as basicAuth from "express-basic-auth";
import {ProductModule} from "./app/product/product.module";
import {ClientModule} from "./app/client/client.module";
import {CatalogoModule} from "./app/catalogo/catalogo.module";
import {PedidoModule} from "./app/pedido/pedido.module";
async function bootstrap() {
  // config();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: {
    origin: '*',
      preflightContinue: true
    } });
    app.use(
        // Paths you want to protect with basic auth
        "/docs*",
        basicAuth({
            challenge: true,
            users: {
                admin: "miradoc",
            },
        })
    );
  const config = new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },)
      .setTitle('Endpoints Api Mira POS')
      .setDescription('API app POS')
      .setVersion('1.0')
      .addServer('http://201.49.29.61:5000/app', 'Local')
      .addServer('http://201.49.29.61:4000/app', 'Local 2')
      // .addServer('http://10.177.51.219:5000/app', 'Local 2')
      // .addServer('http://10.177.51.219:4000/app', 'Local 2')
      //.setBasePath('app')
      // .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config, {include: [
      // OrganizacaoModule,
          ProductModule,
      LojaModule,
      AuthModule,
      UsuarioModule,
      ClientModule,
      CatalogoModule,
      AppModule,
      PedidoModule
    ]});
  SwaggerModule.setup('docs', app, document, {swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      apisSorter: 'alpha'
    },
    customSiteTitle: 'MiraDocs',});
  app.setGlobalPrefix('app', { exclude: ['docs'] });
  app.useGlobalPipes(new ValidationPipe());
    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/images/',

    });
  await app.listen(port, () => {
    console.log('server running on port: ' + port);
  });
}
bootstrap();
