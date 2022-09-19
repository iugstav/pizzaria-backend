import jwt from "jsonwebtoken";

import { auth } from "../../config/auth";
import { Role, User } from "../../modules/User/User";

export function authenticateAdminUser() {
  const user = User.create(
    {
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
      role: Role.Admin,
      phone: "(21) 2345-6789",
    },
    "user123"
  );

  const token = jwt.sign(
    {
      role: String(user.properties.role),
      id: user.id,
    },
    auth.secret,
    {
      expiresIn: auth.expiresIn,
    }
  );

  return {
    user,
    token,
  };
}
