import { IOrderItemsRepository } from "../repositories/IOrderItems.repository";

export class GetOrderItemByIdService {
  public constructor(private orderItemsRepository: IOrderItemsRepository) {}

  public async execute(id: string) {
    const item = await this.orderItemsRepository.getById(id);

    return item;
  }
}
