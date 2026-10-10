import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemType } from './entities/item-type.entity';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { FilterDto } from '../common/filter.dto';
import { paginateQuery } from '../common/pagination.util';
import { Shop } from '../shops/entities/shop.entity';
import {
  applyTenantScope,
  assertShopAccess,
  requireSuperAdmin,
  stampOwnership,
  tenantWhere,
} from '../common/access.util';

@Injectable()
export class ItemTypesService {
  constructor(
    @InjectRepository(ItemType)
    private itemTypesRepository: Repository<ItemType>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async create(dto: CreateItemTypeDto): Promise<ItemType> {
    requireSuperAdmin();
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Name is required');
    }
    if (!dto.shopId) {
      throw new BadRequestException('Shop is required');
    }
    assertShopAccess(dto.shopId);
    const shop = await this.shopRepository.findOne({
      where: tenantWhere({ id: dto.shopId }),
      relations: ['tenant'],
    });
    if (!shop) {
      throw new BadRequestException('Shop not found');
    }
    const tenantId = shop.tenant?.id;
    if (!tenantId) {
      throw new BadRequestException('Shop has no organization assigned');
    }

    const itemType = this.itemTypesRepository.create({ name });
    stampOwnership(itemType, tenantId);
    itemType.shop = shop;
    return this.itemTypesRepository.save(itemType);
  }

  findAll(filterDto?: FilterDto, shopId?: number) {
    const queryBuilder = this.itemTypesRepository.createQueryBuilder('itemType')
      .leftJoinAndSelect('itemType.shop', 'shop')
      .where('itemType.is_archived = :archived', { archived: false });
    applyTenantScope(queryBuilder, 'itemType');

    if (shopId) {
      assertShopAccess(shopId);
      queryBuilder.andWhere('itemType.shop_id = :shopId', { shopId });
    }
    if (filterDto?.search?.trim()) {
      queryBuilder.andWhere('itemType.name ILIKE :term', { term: `%${filterDto.search.trim()}%` });
    }
    queryBuilder.orderBy('itemType.name', 'ASC');
    return paginateQuery(queryBuilder, filterDto);
  }

  findOne(id: number): Promise<ItemType | null> {
    return this.itemTypesRepository.findOne({
      where: tenantWhere({ id, is_archived: false }),
      relations: ['shop'],
    });
  }

  async update(id: number, dto: UpdateItemTypeDto): Promise<ItemType | null> {
    requireSuperAdmin();
    const itemType = await this.findOne(id);
    if (!itemType) {
      return null;
    }
    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (!name) {
        throw new BadRequestException('Name is required');
      }
      itemType.name = name;
    }
    if (dto.shopId !== undefined) {
      assertShopAccess(dto.shopId);
      const shop = await this.shopRepository.findOne({
        where: tenantWhere({ id: dto.shopId }),
        relations: ['tenant'],
      });
      if (!shop) {
        throw new BadRequestException('Shop not found');
      }
      if (!shop.tenant?.id) {
        throw new BadRequestException('Shop has no organization assigned');
      }
      itemType.shop = shop;
      itemType.tenant = shop.tenant;
    }
    await this.itemTypesRepository.save(itemType);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    requireSuperAdmin();
    const itemType = await this.findOne(id);
    if (!itemType) {
      return false;
    }
    itemType.is_archived = true;
    await this.itemTypesRepository.save(itemType);
    return true;
  }
}
