import { IPizzasRepository } from "../repositories/IPizzas.repository";

export class GetPizzaByIdService {
  public constructor(private pizzasRepository: IPizzasRepository) {}

  public async execute(id: string) {
    const pizzaExists = await this.pizzasRepository.exists(id);

    if (!pizzaExists) {
      throw new Error("Pizza not found");
    }

    const pizza = await this.pizzasRepository.getById(id);

    return {
      id: pizza.id,
      name: pizza.properties.name,
      price: pizza.properties.price,
      category: pizza.properties.category,
      description: pizza.properties.description,
    };
  }
}
