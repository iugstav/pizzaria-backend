import { Pizza } from "../Pizza";
import { InMemoryPizzasRepository } from "../repositories/implementations/in-memory/InMemoryPizzas.repository";
import { IPizzasRepository } from "../repositories/IPizzas.repository";
import { RemovePizzaService } from "./RemovePizza.service";

let pizzasRepository: IPizzasRepository;
let removePizzaService: RemovePizzaService;

describe("Remove Pizza service", () => {
  beforeAll(() => {
    pizzasRepository = new InMemoryPizzasRepository();
    removePizzaService = new RemovePizzaService(pizzasRepository);
  });

  it("Should be able to remove a pizza from the repository", async () => {
    const pizza = Pizza.create(
      {
        name: "Pizza de Calabresa",
        category: "Pizzas Salgadas",
        price: 30.0,
        description: "",
        created_at: new Date(),
      },
      "abcd"
    );

    await pizzasRepository.save(pizza);

    const service = await removePizzaService.execute(pizza.id);

    expect(service).toBeTruthy();
  });
});
