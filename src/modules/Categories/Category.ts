import { Entity } from "../../core/Entity";
import { PizzaProps } from "../Pizza/Pizza";

type CategoryProps = {
  name: string;
  pizzas?: PizzaProps[];
};

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryProps, id?: string) {
    super(props, id);
  }

  static create(props: CategoryProps, id?: string) {
    return new Category(props, id);
  }
}
