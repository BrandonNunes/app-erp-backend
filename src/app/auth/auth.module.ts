import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioService } from '../usuario/usuario.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../usuario/entities/usuario.entity';
import { OrganizationModel } from '../business/entities/organizacao.entity';
import { EmpresaModel } from '../business/entities/company.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, OrganizationModel, EmpresaModel]),
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService, JwtService],
})
export class AuthModule {}
