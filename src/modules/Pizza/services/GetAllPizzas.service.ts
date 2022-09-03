import { IPizzasRepository } from "../repositories/IPizzas.repository";

export class GetAllPizzasService {
  public constructor(private pizzasRepository: IPizzasRepository) {}

  public async execute() {
    const pizzas = await this.pizzasRepository.getAll();

    return pizzas;
  }
}
