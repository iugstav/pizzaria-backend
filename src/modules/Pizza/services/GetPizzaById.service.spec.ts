import { Pizza } from "../Pizza";
import { InMemoryPizzasRepository } from "../repositories/implementations/in-memory/InMemoryPizzas.repository";
import { IPizzasRepository } from "../repositories/IPizzas.repository";
import { GetPizzaByIdService } from "./GetPizzaById.service";

let pizzasRepository: IPizzasRepository;
let getPizzaByIdService: GetPizzaByIdService;

describe("Get Pizza By Id service", () => {
  beforeAll(() => {
    pizzasRepository = new InMemoryPizzasRepository();
    getPizzaByIdService = new GetPizzaByIdService(pizzasRepository);
  });

  it("Should be able to return a single pizza from the repository", async () => {
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

    const service = await getPizzaByIdService.execute("abcd");

    expect(service).toHaveProperty("id");
    expect(service.id).toEqual("abcd");
  });

  it("Should not be able to return a single pizza if pizza does not exists in the repository", async () => {
    await expect(getPizzaByIdService.execute("12345")).rejects.toEqual(
      new Error("Pizza not found")
    );
  });
});
