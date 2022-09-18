import { Order } from "../Order";

export interface IOrdersRepository {
  save(order: Order, user_id: string): Promise<void>;
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
