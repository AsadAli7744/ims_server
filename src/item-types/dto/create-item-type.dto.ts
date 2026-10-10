import { IsInt, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemTypeDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  @Type(() => Number)
  shopId: number;
}
