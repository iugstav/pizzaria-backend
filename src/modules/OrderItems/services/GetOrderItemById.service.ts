import { IOrderItemsRepository } from "../repositories/IOrderItems.repository";

export type OrderItemResponse = {
  id: string;
  pizza_id: string;
  order_id: string;
  amount: number;
  customization: string;
};

export class GetOrderItemByIdService {
  public constructor(private orderItemsRepository: IOrderItemsRepository) {}

  public async execute(id: string) {
    const item = await this.orderItemsRepository.getById(id);

    const formattedOrderItem: OrderItemResponse = {
      id: item.id,
      pizza_id: item.properties.pizza_id,
      order_id: item.properties.order_id,
      amount: item.properties.amount,
      customization: item.properties.customization,
    };

    return formattedOrderItem;
  }
}
