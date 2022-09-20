import { IOrdersRepository } from "../repositories/IOrders.repository";
import { OrderResponse } from "./GetOrderById.service";

export class GetAllOrdersService {
  public constructor(private ordersRepository: IOrdersRepository) {}

  public async execute() {
    const orders = await this.ordersRepository.getAll();

    const formattedOrders: OrderResponse[] = orders.map((order) => {
      return {
        id: order.id,
        total_price: order.properties.total_price,
        payment_type: order.properties.payment_type,
        order_status: order.properties.order_status,
        delivered_date: order.properties.delivered_date,
        created_at: order.properties.created_at,
        order_items: order.properties.order_items.map((orderItem) => {
          return {
            id: orderItem.id,
            pizza_id: orderItem.properties.pizza_id,
            order_id: orderItem.properties.order_id,
            amount: orderItem.properties.amount,
            customization: orderItem.properties.customization,
          };
        }),
      };
    });

    return formattedOrders;
  }
}
