import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/users/entities/user.entity';

export const ROLES_KEY = 'roles';

// Uso: @Roles(UserRole.ADMIN) o @Roles(UserRole.ADMIN, UserRole.STAFF)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);