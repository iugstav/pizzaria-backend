import { IPizzasRepository } from "../repositories/IPizzas.repository";

export class RemovePizzaService {
  public constructor(private pizzasRepository: IPizzasRepository) {}

  public async execute(id: string) {
    await this.pizzasRepository.delete(id);

    return true;
  }
}
