import { Pizza } from "../../../Pizza";
import { IPizzasRepository } from "../../IPizzas.repository";

export class InMemoryPizzasRepository implements IPizzasRepository {
  public pizzas: Pizza[] = [];

  public constructor() {}

  public async save(pizza: Pizza): Promise<void> {
    const pizzaAlreadyExists = await this.exists(pizza.properties.name);

    if (pizzaAlreadyExists) {
      throw new Error("A pizza já existe no cardápio.");
    }

    this.pizzas.push(pizza);
  }

  public async getAll(): Promise<Pizza[]> {
    return this.pizzas;
  }

  public async getById(id: string): Promise<Pizza> {
    const pizza = this.pizzas.find((pizza) => pizza.id === id);

    if (!pizza) {
      throw new Error("Pizza not found.");
    }

    return pizza;
  }

  public async delete(id: string): Promise<void> {
    const pizzaIndex = this.pizzas.findIndex((pizza) => pizza.id === id);

    this.pizzas.splice(pizzaIndex, 1);
  }

  public async exists(id: string): Promise<boolean> {
    return this.pizzas.some((pizza) => pizza.id === id);
  }
}
