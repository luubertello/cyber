// src/modules/users/entities/user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Entity('users')
export class User {
  // El id viene de auth.users de Supabase, no lo genera TypeORM
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', default: UserRole.STAFF })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}