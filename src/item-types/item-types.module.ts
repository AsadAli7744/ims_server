import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemType } from './entities/item-type.entity';
import { Shop } from '../shops/entities/shop.entity';
import { ItemTypesService } from './item-types.service';
import { ItemTypesController } from './item-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItemType, Shop])],
  controllers: [ItemTypesController],
  providers: [ItemTypesService],
  exports: [ItemTypesService],
})
export class ItemTypesModule {}
