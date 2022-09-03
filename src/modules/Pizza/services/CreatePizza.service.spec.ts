import { Pizza } from "../Pizza";
import { InMemoryPizzasRepository } from "../repositories/implementations/in-memory/InMemoryPizzas.repository";
import { CreatePizzaService } from "./CreatePizza.service";

let pizzasRepository: InMemoryPizzasRepository;
let createPizzaService: CreatePizzaService;

describe("Create Pizza Service", () => {
  beforeEach(() => {
    pizzasRepository = new InMemoryPizzasRepository();
    createPizzaService = new CreatePizzaService(pizzasRepository);
  });

  it("Should be able to create a pizza", async () => {
    const { id, properties } = Pizza.create({
      name: "Pizza de Pavão",
      category: "Pizzas Salgadas",
      price: 30.0,
      description: "",
      created_at: new Date(),
    });

    const service = await createPizzaService.execute({
      name: properties.name,
      category: properties.category,
      price: properties.price,
      description: properties.description,
      created_at: properties.created_at,
    });

    expect(service.properties.name).toEqual("Pizza de Pavão");
    await expect(pizzasRepository.exists(service.id)).resolves.toBeTruthy();
  });

  it("Should not be able to create a pizza with invalid price", async () => {
    const data = {
      name: "Pizza",
      category: "Pizzas Salgadas",
      price: 0,
      description: "a",
      created_at: new Date(),
    };

    await expect(createPizzaService.execute(data)).rejects.toEqual(
      new Error("Price should be bigger than 0")
    );
  });

  it("Should not be able to create a pizza with invalid name", async () => {
    const data = {
      name: "Pi",
      category: "Pizzas Salgadas",
      price: 30.0,
      description: "a",
      created_at: new Date(),
    };

    await expect(createPizzaService.execute(data)).rejects.toEqual(
      new Error("Erro na criação da pizza: Nome inválido")
    );
  });
});
