import { Pizza } from "../Pizza";

import { InMemoryPizzasRepository } from "../repositories/implementations/in-memory/InMemoryPizzas.repository";
import { IPizzasRepository } from "../repositories/IPizzas.repository";
import { GetAllPizzasService } from "./GetAllPizzas.service";

let pizzasRepository: IPizzasRepository;
let getAllPizzasService: GetAllPizzasService;

describe("Get All Pizzas service", () => {
  beforeAll(() => {
    pizzasRepository = new InMemoryPizzasRepository();
    getAllPizzasService = new GetAllPizzasService(pizzasRepository);
  });

  it("Should be able to get all pizzas from the repository", async () => {
    const pizza1 = Pizza.create(
      {
        name: "Pizza de Calabresa",
        category: "Pizzas Salgadas",
        price: 30.0,
        description: "",
        created_at: new Date(),
      },
      "abcd"
    );

    const pizza2 = Pizza.create(
      {
        name: "Pizza de Costela",
        category: "Pizzas Salgadas",
        price: 45.0,
        description: "",
        created_at: new Date(),
      },
      "12345"
    );

    await pizzasRepository.save(pizza1);
    await pizzasRepository.save(pizza2);

    const service = await getAllPizzasService.execute();

    expect(service.length).toBe(2);
    expect(service[0].id).toEqual("abcd");
    expect(service[1].id).toEqual("12345");
  });
});
