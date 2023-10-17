import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './app/client/entities/client.entity';
import { Users } from './app/usuario/entities/usuario.entity';
import { OrganizationModel } from './app/business/entities/organizacao.entity';
import { ClientModule } from './app/client/client.module';
import { UsuarioModule } from './app/usuario/usuario.module';
import { AuthModule } from './app/auth/auth.module';
import { EmpresaModel } from './app/business/entities/company.entity';
import { UsuarioEmpresaModel } from './app/usuario/entities/usuario_empresa.entity';
import { BusinessModule } from './app/business/business.module';
import { ProductModule } from './app/product/product.module';
import {ProductModel} from "./app/product/entities/product.entity";
import {GrupoProdutoModel} from "./app/product/entities/grupoProduto.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    SequelizeModule.forRoot(
        {
          dialect: 'sqlite',
          database: 'MiraDev',
          host: './dev.sqlite',
          models: [Client, Users, OrganizationModel, EmpresaModel, UsuarioEmpresaModel, ProductModel, GrupoProdutoModel],
          logging: true,
          synchronize: true,
          autoLoadModels: true
        }
    //     {
    //   dialect: 'mssql',
    //   host: 'localhost',
    //   port: 1433,
    //   username: process.env.DBUSERNAME,
    //   password: process.env.DBPASS,
    //   database: 'MiraDev',
    //   schema: 'dbo',
    //   models: [Client, Users, OrganizationModel, EmpresaModel, UsuarioEmpresaModel, ProductModel],
    //   logging: false
    // }
    ),
    ClientModule,
    UsuarioModule,
    AuthModule,
    BusinessModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
