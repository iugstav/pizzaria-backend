import { Entity } from "../../core/Entity";
import { OrderItem } from "../OrderItems/Orderitem";

enum OrderStatus {
  PENDING = 0,
  SENT = 1,
  FINISHED = 2,
}

export type OrderProps = {
  total_price: number;
  payment_type: string;
  order_status: OrderStatus;
  delivered_date?: Date | null;
  created_at: Date;

  order_items: OrderItem[];
};

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);
  }

  static create(props: OrderProps, id?: string) {
    return new Order(props, id);
  }
}
