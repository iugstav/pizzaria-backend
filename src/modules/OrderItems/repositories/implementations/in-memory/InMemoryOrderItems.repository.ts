import { OrderItem } from "../../../Orderitem";
import { IOrderItemsRepository } from "../../IOrderItems.repository";

export class InMemoryOrderItemsRepository implements IOrderItemsRepository {
  public orderItems: OrderItem[] = [];

  public constructor() {}

  public async save(orderItem: OrderItem): Promise<void> {
    this.orderItems.push(orderItem);
  }

  public async getAllFromAnOrder(orderId: string): Promise<OrderItem[]> {
    const allOrderItemsFromAnOrder = this.orderItems.filter(
      (orderItem) => orderItem.properties.order_id === orderId
    );

    if (allOrderItemsFromAnOrder.length === 0) {
      throw new Error("Id do pedido inválido.");
    }

    return allOrderItemsFromAnOrder;
  }

  public async getById(orderItemId: string): Promise<OrderItem> {
    const orderItem = this.orderItems.find(
      (orderItem) => orderItem.id === orderItemId
    );

    if (!orderItem) {
      throw new Error("Item do pedido não encontrado.");
    }

    return orderItem;
  }
}
