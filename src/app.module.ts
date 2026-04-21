import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComputersModule } from './modules/computers/computers.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SalesModule } from './modules/sales/sales.module';
import { ProductsModule } from './modules/products/products.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { EventsModule } from './modules/events/events.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ComputersModule, SessionsModule, MetricsModule, NotificationsModule, SalesModule, ProductsModule, ExpensesModule, EventsModule, MaintenanceModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
