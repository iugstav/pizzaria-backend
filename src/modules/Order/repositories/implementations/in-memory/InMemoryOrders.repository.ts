import { Order } from "../../../Order";
import { IOrdersRepository } from "../../IOrders.repository";

export class InMemoryOrdersRepository implements IOrdersRepository {
  public orders: Order[] = [];

  public constructor() {}

  public async save(order: Order): Promise<void> {
    this.orders.push(order);
  }

  public async getAll(): Promise<Order[]> {
    return this.orders;
  }

  public async getById(id: string): Promise<Order> {
    const order = this.orders.find((order) => order.id === id);

    if (!order) {
      throw new Error("Pedido inválido");
    }

    return order;
  }

  public async delete(id: string): Promise<void> {
    const orderIndex = this.orders.findIndex((order) => order.id === id);

    this.orders.splice(orderIndex, 1);
  }

  public async exists(id: string): Promise<boolean> {
    const orderExists = this.orders.some((order) => order.id === id);

    return orderExists;
  }
}
