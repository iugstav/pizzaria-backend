import { Role, User } from "../User";
import { InMemoryUsersRepository } from "../repositories/implementations/in-memory/InMemoryUsers.repository";
import { CreateUserService } from "./CreateUser.service";

let usersRepository: InMemoryUsersRepository;
let createUserService: CreateUserService;

describe("Create User service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserService = new CreateUserService(usersRepository);
  });

  it("Should be able to create an user", async () => {
    const user = User.create({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe10@mail.com",
      password: "johndoe123",
      address: {
        id: "1",
        address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
        number: 453,
        state: "Espírito Santo",
      },
      role: Role.Customer,
      phone: "(21) 2345-6789",
    });

    const service = await createUserService.execute(user.properties);

    expect(await usersRepository.exists(service.properties.email)).toBeTruthy();
  });

  it("Should not be able to create an user with invalid email", async () => {
    const user = User.create({
      firstName: "John",
      lastName: "Doe",
      email: "doe",
      password: "johndoe123",
      address: {
        id: "1",
        address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
        number: 453,
        state: "Espírito Santo",
      },
      role: Role.Customer,
      phone: "(21) 2345-6789",
    });

    await expect(createUserService.execute(user.properties)).rejects.toEqual(
      new Error("invalid parameter email. Email does not match")
    );
  });

  it("Should not be able to create an user with an existing email in persistence", async () => {
    const user1 = User.create({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe10@mail.com",
      password: "johndoe123",
      address: {
        id: "1",
        address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
        number: 453,
        state: "Espírito Santo",
      },
      role: Role.Customer,
      phone: "(21) 2345-6789",
    });

    const user2 = User.create({
      firstName: "Joe",
      lastName: "Done",
      email: "johndoe10@mail.com",
      password: "mase1010",
      address: {
        id: "1",
        address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
        number: 453,
        state: "Espírito Santo",
      },
      role: Role.Customer,
      phone: "(21) 2345-6789",
    });

    const service = await createUserService.execute(user1.properties);

    await expect(createUserService.execute(user2.properties)).rejects.toEqual(
      new Error("An user already owns this email. Please insert another")
    );
  });
});
