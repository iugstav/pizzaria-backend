import { IOrderItemsRepository } from "../repositories/IOrderItems.repository";
import { OrderItemResponse } from "./GetOrderItemById.service";

export class GetAllOrderItemsFromOrderService {
  public constructor(private orderItemsRepository: IOrderItemsRepository) {}

  public async execute(orderId: string) {
    const items = await this.orderItemsRepository.getAllFromAnOrder(orderId);

    const formattedOrderItems: OrderItemResponse[] = items.map((orderItem) => {
      return {
        id: orderItem.id,
        pizza_id: orderItem.properties.pizza_id,
        order_id: orderItem.properties.order_id,
        amount: orderItem.properties.amount,
        customization: orderItem.properties.customization,
      };
    });

    return formattedOrderItems;
  }
}
