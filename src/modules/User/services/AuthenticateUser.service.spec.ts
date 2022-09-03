import { InMemoryUsersRepository } from "../repositories/implementations/in-memory/InMemoryUsers.repository";
import { AuthenticateUserService } from "./AuthenticateUser.service";
import { Role, User } from "../User";
import bcrypt from "bcryptjs";

let authenticateUserService: AuthenticateUserService;
let usersRepository: InMemoryUsersRepository;

describe("Authenticate User service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserService = new AuthenticateUserService(usersRepository);
  });

  it("Should be able to authenticate a created user", async () => {
    const hashed = await bcrypt.hash("mase1010", 8);

    const user = User.create(
      {
        firstName: "Joe",
        lastName: "Done",
        email: "johndoe10@mail.com",
        password: hashed,
        address: {
          id: "1",
          address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
          number: 453,
          state: "Espírito Santo",
        },
        role: Role.Customer,
        phone: "(21) 2345-6789",
      },
      "user12345"
    );

    await usersRepository.create(user);

    const service = await authenticateUserService.execute({
      email: user.properties.email,
      password: "mase1010",
    });

    expect(service).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
  });

  it("Should not be able to authenticate an user that was not created", async () => {
    const user = User.create(
      {
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
      },
      "user12345"
    );

    await expect(
      authenticateUserService.execute({
        email: user.properties.email,
        password: user.properties.password,
      })
    ).rejects.toEqual(new Error("User not created"));
  });

  it("Should not be able to authenticate a created user with invalid password", async () => {
    const user = User.create(
      {
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
      },
      "user12345"
    );

    await usersRepository.create(user);

    await expect(
      authenticateUserService.execute({
        email: user.properties.email,
        password: "wrongpassword123",
      })
    ).rejects.toEqual(new Error("Invalid email and/or password"));
  });
});
