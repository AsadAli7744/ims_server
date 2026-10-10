export class CreateItemDto {
  name: string;
  company: number;
  categories: number[];
  storeId?: number;
  shopId?: number;
  itemTypeId?: number | null;
  location?: string;
  uniqueIdentifier?: string;
  condition?: string;
  quantity: number;
  purchasePrice: number;
  minimumSalePrice: number;
}
