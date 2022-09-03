import { User } from "../../../User";
import { IUsersRepository } from "../../IUsers.repository";

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = [];

  public constructor() {}

  public async create(user: User): Promise<void> {
    this.users.push(user);
  }

  public async exists(email: string): Promise<boolean> {
    return this.users.some((user) => user.properties.email === email);
  }

  public async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.properties.email === email);

    if (!user) {
      throw new Error("User not created");
    }

    if (!user.properties.address) {
      throw new Error("invalid user address");
    }

    return user;
  }
}
