import { IOrdersRepository } from "../repositories/IOrders.repository";

interface ChangeOrderStatusRequest {
  orderId: string;
  newOrderStatus: number;
}

export class ChangeOrderStatusService {
  public constructor(private ordersRepository: IOrdersRepository) {}

  public async execute({
    orderId,
    newOrderStatus,
  }: ChangeOrderStatusRequest): Promise<void> {
    if (newOrderStatus < 0 || newOrderStatus > 2) {
      throw new Error("Invalid order status");
    }

    const orderExists = await this.ordersRepository.exists(orderId);

    if (!orderExists) {
      throw new Error("Order does not exist");
    }

    await this.ordersRepository.changeOrderStatus(orderId, newOrderStatus);

    return;
  }
}
