import { OrderItem } from "../../OrderItems/Orderitem";
import { Order } from "../Order";
import { IOrdersRepository } from "../repositories/IOrders.repository";

type CreateOrderOrderItem = {
  id: string;
  pizza_id: string;
  order_id: string;
  amount: number;
  customization: string;
};

type CreateOrderRequest = {
  id: string;
  total_price: number;
  payment_type: string;
  order_status: number;
  created_at: Date;
  user_id: string;

  order_items: CreateOrderOrderItem[];
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

    const mappedOrderItems = order_items.map((orderItem) => {
      return OrderItem.create(
        {
          pizza_id: orderItem.pizza_id,
          order_id: orderItem.order_id,
          amount: orderItem.amount,
          customization: orderItem.customization,
        },
        orderItem.id
      );
    });

    const newOrder = Order.create(
      {
        total_price,
        payment_type,
        order_status,
        order_items: mappedOrderItems,
        created_at,
        delivered_date: null,
      },
      id
    );

    console.log(newOrder.properties.order_items);

    await this.ordersRepository.save(newOrder, user_id);

    return;
  }
}
