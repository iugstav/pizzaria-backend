import { OrderItem } from "../Orderitem";
import { InMemoryOrderItemsRepository } from "../repositories/implementations/in-memory/InMemoryOrderItems.repository";
import { GetAllOrderItemsFromOrderService } from "./GetAllOrderItemsFromOrder.service";

let orderItemsRepository: InMemoryOrderItemsRepository;
let getAllOrderItemsFromOrderService: GetAllOrderItemsFromOrderService;

describe("Get All Order Items From An Order service", () => {
  beforeAll(() => {
    orderItemsRepository = new InMemoryOrderItemsRepository();
    getAllOrderItemsFromOrderService = new GetAllOrderItemsFromOrderService(
      orderItemsRepository
    );
  });

  it("Should be able to retrieve all the order items from an order", async () => {
    let orderItem1 = OrderItem.create(
      {
        order_id: "order123",
        pizza_id: "pizza1",
        amount: 1,
        customization: "",
      },
      "orderItem123"
    );

    let orderItem2 = OrderItem.create(
      {
        order_id: "order123",
        pizza_id: "pizza2",
        amount: 3,
        customization: "",
      },
      "orderItem456"
    );

    await orderItemsRepository.save(orderItem1);
    await orderItemsRepository.save(orderItem2);

    const service = await getAllOrderItemsFromOrderService.execute("order123");

    expect(service.length).toBe(2);
    expect(service[0].id).toEqual("orderItem123");
    expect(service[1].id).toEqual("orderItem456");
  });

  it("Should not be able to retrieve all the order items from an order with invalid order id", async () => {
    await expect(
      getAllOrderItemsFromOrderService.execute("order5050")
    ).rejects.toEqual(new Error("Id do pedido inválido."));
  });
});
