import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopsModule } from './shops/shops.module';
import { StoresModule } from './stores/stores.module';
import { CompaniesModule } from './companies/companies.module';
import { ItemsModule } from './items/items.module';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';
import { SellersModule } from './sellers/sellers.module';
import { ServiceJobsModule } from './service-jobs/service-jobs.module';
import { InstallmentsModule } from './installments/installments.module';
import { OrdersModule } from './orders/orders.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { IssuesModule } from './issues/issues.module';
import { Shop } from './shops/entities/shop.entity';
import { Store } from './stores/entities/store.entity';
import { Category } from './category/entities/category.entity';
import { Company } from './companies/entities/company.entity';
import { Item } from './items/entities/item.entity';
import { Sale } from './sales/entities/sale.entity';
import { SaleItem } from './sale-items/entities/sale-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './order-items/entities/order-item.entity';
import { Purchase } from './purchases/entities/purchase.entity';
import { Expense } from './expense/entities/expense.entity';
import { Issue } from './issues/entities/issue.entity';
import { User } from './users/entities/user.entity';
import { StockLot } from './stock-lots/entities/stock-lot.entity';
import { StockAllocation } from './stock-lots/entities/stock-allocation.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StockLotsModule } from './stock-lots/stock-lots.module';
import { Tenant } from './tenants/entities/tenant.entity';
import { Customer } from './customers/entities/customer.entity';
import { Seller } from './sellers/entities/seller.entity';
import { SalePayment } from './sale-payments/entities/sale-payment.entity';
import { ServiceJob } from './service-jobs/entities/service-job.entity';
import { ServicePayment } from './service-payments/entities/service-payment.entity';
import { InstallmentPlan } from './installments/entities/installment-plan.entity';
import { InstallmentDue } from './installments/entities/installment-due.entity';
import { AuthAlsInterceptor } from './auth/auth-als.interceptor';
import { UserPermission } from './user-permissions/entities/user-permission.entity';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { RbacModule } from './rbac/rbac.module';
import { AuthGuard } from './rbac/guards/auth.guard';
import { RolesGuard } from './rbac/guards/roles.guard';
import { PermissionsGuard } from './rbac/guards/permissions.guard';
import { getTypeOrmConfig } from './config/database.config';

const ALL_ENTITIES = [
  Shop, Store, Category, Company, Item, Sale, SaleItem, Order, OrderItem,
  Purchase, Expense, Issue, User, StockLot, StockAllocation, Tenant,
  Customer, Seller, SalePayment, ServiceJob, ServicePayment, InstallmentPlan, InstallmentDue,
  UserPermission,
];

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig(ALL_ENTITIES)),
    ShopsModule,
    StoresModule,
    CompaniesModule,
    ItemsModule,
    SalesModule,
    CustomersModule,
    SellersModule,
    ServiceJobsModule,
    InstallmentsModule,
    OrdersModule,
    PurchasesModule,
    ExpenseModule,
    CategoryModule,
    IssuesModule,
    StockLotsModule,
    AuthModule,
    UsersModule,
    UserPermissionsModule,
    RbacModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_INTERCEPTOR, useClass: AuthAlsInterceptor },
  ],
})
export class AppModule {}
