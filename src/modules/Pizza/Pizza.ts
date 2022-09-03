import { Entity } from "../../core/Entity";

export type PizzaProps = {
  name: string;
  price: number;
  category: string;
  description?: string | null;
  created_at: Date;
};

export class Pizza extends Entity<PizzaProps> {
  private constructor(props: PizzaProps, id?: string) {
    super(props, id);
  }

  static create(props: PizzaProps, id?: string) {
    return new Pizza(props, id);
  }
}
