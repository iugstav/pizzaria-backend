import { IOrderItemsRepository } from "../repositories/IOrderItems.repository";

export class GetAllOrderItemsFromOrderService {
  public constructor(private orderItemsRepository: IOrderItemsRepository) {}

  public async execute(orderId: string) {
    const items = await this.orderItemsRepository.getAllFromAnOrder(orderId);

    return items;
  }
}
