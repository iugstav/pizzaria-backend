import { randomUUID } from "crypto";

import { Pizza } from "../Pizza";
import { IPizzasRepository } from "../repositories/IPizzas.repository";

type CreatePizzaServiceRequest = {
  name: string;
  price: number;
  category: string;
  description?: string | null;
  created_at: Date;
};

const pizzaNameRegex: RegExp = /\b([A-ZÀ-ÿ][-,a-z ']+[ ]*)+/gm;

export class CreatePizzaService {
  constructor(private pizzasRepository: IPizzasRepository) {}

  public async execute(pizza: CreatePizzaServiceRequest) {
    if (pizza.name.length <= 4) {
      throw new Error("Erro na criação da pizza: Nome inválido");
    }

    if (pizza.price <= 0) {
      throw new Error("Price should be bigger than 0");
    }

    const pizzaId = randomUUID();

    const newPizza = Pizza.create(pizza, pizzaId);

    await this.pizzasRepository.save(newPizza);

    return newPizza;
  }
}
