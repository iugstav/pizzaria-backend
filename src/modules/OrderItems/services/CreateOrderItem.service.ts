import { randomUUID } from "crypto";
import { IOrdersRepository } from "../../Order/repositories/IOrders.repository";
import { IPizzasRepository } from "../../Pizza/repositories/IPizzas.repository";
import { OrderItem } from "../Orderitem";

import { IOrderItemsRepository } from "../repositories/IOrderItems.repository";

type CreateOrderItemRequest = {
  pizza_id: string;
  order_id: string;
  amount: number;
  customization: string;
};

export class CreateOrderItemService {
  public constructor(
    private orderItemsRepository: IOrderItemsRepository,
    private ordersRepository: IOrdersRepository,
    private pizzasRepository: IPizzasRepository
  ) {}

  public async execute(orderItem: CreateOrderItemRequest) {
    const pizzaExists = await this.pizzasRepository.exists(orderItem.pizza_id);
    const orderExists = await this.ordersRepository.exists(orderItem.order_id);

    if (!pizzaExists) {
      throw new Error("A pizza não existe");
    }

    if (!orderExists) {
      throw new Error("O pedido não existe");
    }

    if (!orderItem.amount || orderItem.amount <= 0) {
      throw new Error("Quantidade do item do pedido inválida.");
    }

    const orderItemId = randomUUID();

    const item = OrderItem.create(orderItem, orderItemId);

    await this.orderItemsRepository.save(item);

    return;
  }
}
