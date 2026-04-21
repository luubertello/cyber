import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../../database/supabase.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    // 1. Crear el usuario en Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true, // lo confirmamos automáticamente desde el backend
    });

    if (error || !data.user) {
      throw new InternalServerErrorException(
        error?.message ?? 'Error al crear usuario en Supabase Auth',
      );
    }

    // 2. Crear el perfil en nuestra tabla users
    const user = await this.usersService.create({
      id: data.user.id,
      name: dto.name,
      role: dto.role,
    });

    // 3. Devolver token JWT propio (no el de Supabase)
    return {
      accessToken: this.generateToken(user),
      user,
    };
  }

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    // Verificamos credenciales contra Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Traemos el perfil de nuestra tabla
    const user = await this.usersService.findOne(data.user.id).catch(() => {
      throw new UnauthorizedException(
        'Usuario no encontrado en el sistema. Contactá al administrador.',
      );
    });

    return {
      accessToken: this.generateToken(user),
      user,
    };
  }

  async me(user: User) {
    // El usuario ya viene validado por JwtStrategy
    return user;
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });
  }
}