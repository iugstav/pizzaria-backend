import { OrderItem } from "../Orderitem";

export interface IOrderItemsRepository {
  save(orderItem: OrderItem): Promise<void>;
  getAllFromAnOrder(orderId: string): Promise<OrderItem[]>;
  getById(orderItemId: string): Promise<OrderItem>;
}
