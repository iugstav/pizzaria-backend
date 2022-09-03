import { IOrdersRepository } from "../repositories/IOrders.repository";

export class GetOrderByIdService {
  public constructor(private ordersRepository: IOrdersRepository) {}

  public async execute(id: string) {
    const order = await this.ordersRepository.getById(id);

    return order;
  }
}
