import { User } from "../User";

export interface IUsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
  exists(email: string): Promise<boolean>;
}
