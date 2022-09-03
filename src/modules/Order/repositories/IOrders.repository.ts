import { Order } from "../Order";

export interface IOrdersRepository {
  save(order: Order): Promise<void>;
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
