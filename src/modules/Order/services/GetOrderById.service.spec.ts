import { Order } from "../Order";
import { InMemoryOrdersRepository } from "../repositories/implementations/in-memory/InMemoryOrders.repository";
import { GetOrderByIdService, OrderResponse } from "./GetOrderById.service";

let ordersRepository: InMemoryOrdersRepository;
let getOrderByIdService: GetOrderByIdService;

describe("Get Order By Id service", () => {
  beforeAll(() => {
    ordersRepository = new InMemoryOrdersRepository();
    getOrderByIdService = new GetOrderByIdService(ordersRepository);
  });

  it("Should be able to retrieve an order by it's id", async () => {
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

    await ordersRepository.save(order);

    const response: OrderResponse = {
      id: order.id,
      total_price: order.properties.total_price,
      payment_type: order.properties.payment_type,
      order_status: order.properties.order_status,
      delivered_date: order.properties.delivered_date,
      created_at: order.properties.created_at,
      order_items: order.properties.order_items.map((orderItem) => {
        return {
          id: orderItem.id,
          pizza_id: orderItem.properties.pizza_id,
          order_id: orderItem.properties.order_id,
          amount: orderItem.properties.amount,
          customization: orderItem.properties.customization,
        };
      }),
    };

    await expect(getOrderByIdService.execute(order.id)).resolves.toEqual(
      response
    );
  });

  it("Should not be able to retrieve an order by it's id with invalid id", async () => {
    const order = Order.create(
      {
        order_status: 0,
        total_price: 60.0,
        payment_type: "money",
        delivered_date: null,
        order_items: [],
        created_at: new Date(),
      },
      "order456"
    );

    await ordersRepository.save(order);

    await expect(getOrderByIdService.execute("random_order")).rejects.toEqual(
      new Error("Pedido inválido")
    );
  });
});
