export interface CookingTimeResponse {
  date: Date;
  avg: number;
  sum: number;
  count: number;
}
export interface PickupTimeResponse {
  date: Date;
  avg: number;
  sum: number;
  count: number;
}

export interface PopularProductsResponse {
  id: string;
  quantity: number;
  name: string;
}

export interface CanceledOrdersResponse {
  date: Date;
  created: number;
  canceled: number;
  total: number;
}
