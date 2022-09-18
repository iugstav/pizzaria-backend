import { randomUUID } from "crypto";
import { Order } from "../Order";
import { IOrdersRepository } from "../repositories/IOrders.repository";

type CreateOrderRequest = {
  id: string;
  total_price: number;
  payment_type: string;
  order_status: number;
  created_at: Date;
  user_id: string;

  // i'll type it later
  order_items: any[];
};

export class CreateOrderService {
  public constructor(private ordersRepository: IOrdersRepository) {}

  public async execute({
    id,
    total_price,
    payment_type,
    order_status,
    created_at,
    order_items,
    user_id,
  }: CreateOrderRequest) {
    if (total_price <= 0) {
      throw new Error("O pedido precisa ter um valor acima de 0.");
    }

    const newOrder = Order.create(
      {
        total_price,
        payment_type,
        order_status,
        order_items,
        created_at,
        delivered_date: null,
      },
      id
    );

    await this.ordersRepository.save(newOrder, user_id);

    return true;
  }
}
