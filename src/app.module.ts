import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './app/client/entities/client.entity';
import { ClientModule } from './app/client/client.module';
import { UsuarioModule } from './app/usuario/usuario.module';
import { AuthModule } from './app/auth/auth.module';
import { LojaModule } from './app/loja/loja.module';
import {LojaModel} from "./app/loja/entities/loja.entity";
import { OrganizacaoModule } from './app/organizacao/organizacao.module';
import {UsuarioModel} from "./app/usuario/entities/usuario.entity";
import {OrganizacaoModel} from "./app/organizacao/entities/organizacao.entity";
import {UsuarioLojaModel} from "./app/usuario/entities/usuario_loja.entity";
import {ProdutoModel} from "./app/product/entities/produto.entity";
import {ProductModule} from "./app/product/product.module";
import {TipoProdutoModel} from "./app/product/entities/tipo_produto.entity";
import * as process from "process";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    SequelizeModule.forRoot(
        // {
        //   dialect: 'mssql',
        //   database: process.env.DATABASE_NAME,
        //   // schema: 'dbo',
        //   // port: 1433,
        //   host: process.env.DATABASE_HOST,
        //   username: process.env.DATABASE_USER,
        //   password: process.env.DATABASE_PASS,
        //   models: [Client, UsuarioModel, OrganizacaoModel, LojaModel, UsuarioLojaModel, ProdutoModel, TipoProdutoModel],
        //   logging: true,
        //   //synchronize: true,
        //   autoLoadModels: true,
        // }
        {
      dialect: 'mssql',
      host: process.env.DATABASE_HOST,
      port: 1433,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      schema: 'dbo',
          models: [UsuarioModel, LojaModel, OrganizacaoModel],
     // models: [Client, Users, OrganizationModel, EmpresaModel, UsuarioEmpresaModel, ProductModel, GrupoProdutoModel, ContractModel],
      logging: false
    }
    ),
    ClientModule,
    UsuarioModule,
    AuthModule,
    ProductModule,
    LojaModule,
    OrganizacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
