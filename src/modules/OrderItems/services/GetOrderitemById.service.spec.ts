import { InMemoryOrderItemsRepository } from "../repositories/implementations/in-memory/InMemoryOrderItems.repository";
import {
  GetOrderItemByIdService,
  OrderItemResponse,
} from "./GetOrderItemById.service";
import { OrderItem } from "../Orderitem";

let orderItemsRepository: InMemoryOrderItemsRepository;
let getOrderItemsByIdService: GetOrderItemByIdService;

describe("Get Order Item By Id service", () => {
  {
    beforeAll(() => {
      orderItemsRepository = new InMemoryOrderItemsRepository();
      getOrderItemsByIdService = new GetOrderItemByIdService(
        orderItemsRepository
      );
    });

    it("Should be able to get an order item by it's id", async () => {
      const orderItem = OrderItem.create(
        {
          order_id: "order123",
          pizza_id: "pizza123",
          amount: 1,
          customization: "",
        },
        "orderItem123"
      );

      await orderItemsRepository.save(orderItem);

      const response: OrderItemResponse = {
        id: orderItem.id,
        pizza_id: orderItem.properties.pizza_id,
        order_id: orderItem.properties.order_id,
        amount: orderItem.properties.amount,
        customization: orderItem.properties.customization,
      };

      await expect(
        getOrderItemsByIdService.execute(orderItem.id)
      ).resolves.toEqual(response);
    });

    it("Should not be able to get an order by it's id with invalid id", async () => {
      const orderItem = OrderItem.create(
        {
          order_id: "order123",
          pizza_id: "pizza123",
          amount: 1,
          customization: "",
        },
        "orderItem123"
      );

      await orderItemsRepository.save(orderItem);

      await expect(orderItemsRepository.getById("randomId")).rejects.toEqual(
        new Error("Item do pedido não encontrado.")
      );
    });
  }
});
