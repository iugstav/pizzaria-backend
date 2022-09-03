import { Entity } from "../../core/Entity";

export type OrderItemProps = {
  pizza_id: string;
  amount: number;
  order_id: string;
  customization: string;
};

export class OrderItem extends Entity<OrderItemProps> {
  private constructor(props: OrderItemProps, id?: string) {
    super(props, id);
  }

  static create(props: OrderItemProps, id?: string) {
    return new OrderItem(props, id);
  }
}
