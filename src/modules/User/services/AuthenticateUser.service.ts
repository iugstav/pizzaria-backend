import { IUsersRepository } from "../repositories/IUsers.repository";
import { auth } from "../../../config/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthenticateUserServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateUserServiceResponse {
  token: string;
}

export class AuthenticateUserService {
  public constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    email,
    password,
  }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    const doesPasswordMatch = await bcrypt.compare(
      password,
      user.properties.password
    );

    if (!doesPasswordMatch) {
      throw new Error("Invalid email and/or password");
    }

    const token = jwt.sign({}, auth.secret, {
      subject: user.id,
      expiresIn: auth.expiresIn,
    });

    return {
      token,
    };
  }
}
