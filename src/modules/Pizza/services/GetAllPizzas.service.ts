import { IPizzasRepository } from "../repositories/IPizzas.repository";

export class GetAllPizzasService {
  public constructor(private pizzasRepository: IPizzasRepository) {}

  public async execute() {
    const pizzas = await this.pizzasRepository.getAll();

    const formattedPizzas = pizzas.map((pizza) => {
      return {
        id: pizza.id,
        name: pizza.properties.name,
        price: pizza.properties.price,
        category: pizza.properties.category,
        description: pizza.properties.description,
      };
    });

    return formattedPizzas;
  }
}
