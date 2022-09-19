import { InMemoryOrderItemsRepository } from "../../OrderItems/repositories/implementations/in-memory/InMemoryOrderItems.repository";
import { InMemoryPizzasRepository } from "../../Pizza/repositories/implementations/in-memory/InMemoryPizzas.repository";
import { Order } from "../Order";
import { InMemoryOrdersRepository } from "../repositories/implementations/in-memory/InMemoryOrders.repository";
import { CreateOrderService } from "./CreateOrder.service";

// let pizzasRepository: InMemoryPizzasRepository;
// let orderItemsRepository: InMemoryOrderItemsRepository;
let ordersRepository: InMemoryOrdersRepository;
let createOrderService: CreateOrderService;

describe("Create Order service", () => {
  beforeAll(() => {
    ordersRepository = new InMemoryOrdersRepository();
    createOrderService = new CreateOrderService(ordersRepository);
  });

  it("Should be able to create an order", async () => {
    const order = Order.create(
      {
        order_status: 0,
        total_price: 60.0,
        payment_type: "money",
        delivered_date: null,
        order_items: [],
        created_at: new Date(),
      },
      "order123"
    );

    await createOrderService.execute({
      id: order.id,
      order_status: order.properties.order_status,
      total_price: order.properties.total_price,
      payment_type: order.properties.payment_type,
      order_items: order.properties.order_items,
      created_at: order.properties.created_at,
      user_id: "usuario123",
    });

    expect(await ordersRepository.getById(order.id)).toEqual(order);
  });

  it("Should not be able to create an order with invalid total price", async () => {
    const order = Order.create(
      {
        order_status: 0,
        total_price: -1,
        payment_type: "money",
        delivered_date: null,
        order_items: [],
        created_at: new Date(),
      },
      "order456"
    );

    await expect(
      createOrderService.execute({
        id: order.id,
        order_status: order.properties.order_status,
        total_price: order.properties.total_price,
        payment_type: order.properties.payment_type,
        order_items: order.properties.order_items,
        created_at: order.properties.created_at,
        user_id: "usuario123",
      })
    ).rejects.toEqual(new Error("O pedido precisa ter um valor acima de 0."));
  });
});
