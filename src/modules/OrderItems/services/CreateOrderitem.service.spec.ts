import { InMemoryPizzasRepository } from "../../Pizza/repositories/implementations/in-memory/InMemoryPizzas.repository";
import { InMemoryOrderItemsRepository } from "../repositories/implementations/in-memory/InMemoryOrderItems.repository";

import { CreateOrderItemService } from "./CreateOrderItem.service";
import { InMemoryOrdersRepository } from "../../Order/repositories/implementations/in-memory/InMemoryOrders.repository";

import { Pizza } from "../../Pizza/Pizza";
import { Order } from "../../Order/Order";

let pizzasRepository: InMemoryPizzasRepository;
let orderItemsRepository: InMemoryOrderItemsRepository;
let ordersRepository: InMemoryOrdersRepository;

let createOrderItemService: CreateOrderItemService;

describe("Create Order Item service", () => {
  beforeAll(() => {
    pizzasRepository = new InMemoryPizzasRepository();
    orderItemsRepository = new InMemoryOrderItemsRepository();
    ordersRepository = new InMemoryOrdersRepository();

    createOrderItemService = new CreateOrderItemService(
      orderItemsRepository,
      ordersRepository,
      pizzasRepository
    );
  });

  it("Should be able to create an order item", async () => {
    //pizza creation to use pizza_id
    const pizza = Pizza.create(
      {
        name: "Carnuda",
        category: "Pizzas Salgadas",
        price: 30.0,
        description: "",
        created_at: new Date(),
      },
      "pizza123"
    );

    await pizzasRepository.save(pizza);

    //order creation to use order_id
    let order = Order.create(
      {
        order_status: 0,
        total_price: 10.0,
        payment_type: "money",
        order_items: [],
        delivered_date: null,
        created_at: new Date(),
      },
      "order123"
    );

    await ordersRepository.save(order);

    await createOrderItemService.execute({
      pizza_id: pizza.id,
      order_id: order.id,
      amount: 2,
      customization: "",
    });

    expect(orderItemsRepository.orderItems.length).toBe(1);
    expect(orderItemsRepository.orderItems[0]).toHaveProperty("id");
  });

  it("Should not be able to create an order item if pizza does not exists", async () => {
    let order = Order.create(
      {
        order_status: 0,
        total_price: 10.0,
        payment_type: "money",
        order_items: [],
        delivered_date: null,
        created_at: new Date(),
      },
      "order123"
    );

    await ordersRepository.save(order);

    await expect(
      createOrderItemService.execute({
        pizza_id: "random_pizza123",
        order_id: order.id,
        amount: 2,
        customization: "",
      })
    ).rejects.toEqual(new Error("A pizza não existe"));
  });

  it("Should not be able to create an order item if order does not exists", async () => {
    const pizza = Pizza.create(
      {
        name: "Menguda",
        category: "Pizzas Salgadas",
        price: 30.0,
        description: "",
        created_at: new Date(),
      },
      "pizza123"
    );

    await expect(
      createOrderItemService.execute({
        pizza_id: pizza.id,
        order_id: "random_order123",
        amount: 2,
        customization: "",
      })
    ).rejects.toEqual(new Error("O pedido não existe"));
  });

  it("Should not be able to create an order item with invalid amount", async () => {
    const pizza = Pizza.create(
      {
        name: "Carnuda",
        category: "Pizzas Salgadas",
        price: 30.0,
        description: "",
        created_at: new Date(),
      },
      "pizza123"
    );

    await pizzasRepository.save(pizza);

    //order creation to use order_id
    let order = Order.create(
      {
        order_status: 0,
        total_price: 60.0,
        payment_type: "money",
        order_items: [],
        delivered_date: null,
        created_at: new Date(),
      },
      "order123"
    );

    await ordersRepository.save(order);

    await expect(
      createOrderItemService.execute({
        pizza_id: pizza.id,
        order_id: order.id,
        amount: 0,
        customization: "",
      })
    ).rejects.toEqual(new Error("Quantidade do item do pedido inválida."));
  });
});
