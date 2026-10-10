import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ItemTypesService } from './item-types.service';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { FilterDto } from '../common/filter.dto';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '../common/request-context';

@Controller('item-types')
export class ItemTypesController {
  constructor(private readonly itemTypesService: ItemTypesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateItemTypeDto) {
    return this.itemTypesService.create(dto);
  }

  @Get()
  findAll(@Query() filterDto: FilterDto, @Query('shopId') shopId?: string) {
    return this.itemTypesService.findAll(filterDto, shopId ? +shopId : undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const itemType = await this.itemTypesService.findOne(+id);
    if (!itemType) {
      return { error: 'Item type not found' };
    }
    return itemType;
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateItemTypeDto) {
    const itemType = await this.itemTypesService.update(+id, dto);
    if (!itemType) {
      return { error: 'Item type not found' };
    }
    return itemType;
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.itemTypesService.remove(+id);
    if (!result) {
      return { error: 'Item type not found' };
    }
    return { message: 'Item type deleted successfully' };
  }
}
