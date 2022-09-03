import { IOrdersRepository } from "../repositories/IOrders.repository";

export class GetAllOrdersService {
  public constructor(private ordersRepository: IOrdersRepository) {}

  public async execute() {
    const orders = await this.ordersRepository.getAll();

    return orders;
  }
}
