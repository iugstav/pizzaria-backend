import { IOrdersRepository } from "../repositories/IOrders.repository";

export type OrderResponse = {
  id: string;
  total_price: number;
  payment_type: string;
  order_status: number;
  delivered_date: Date | null | undefined;
  created_at: Date;
  order_items: {
    id: string;
    pizza_id: string;
    order_id: string;
    amount: number;
    customization: string;
  }[];
};

export class GetOrderByIdService {
  public constructor(private ordersRepository: IOrdersRepository) {}

  public async execute(id: string) {
    const order = await this.ordersRepository.getById(id);

    const formattedOrder: OrderResponse = {
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

    return formattedOrder;
  }
}
