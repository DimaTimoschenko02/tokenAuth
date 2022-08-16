import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes'
import TokenService from "../services/token.service";
import UserService from "../services/user.service";
import setCookie from "../utils/cookies";
import getLatency from "../utils/getLatency";
class UserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}
  async getInfo(req: Request, res: Response) {
    const user = req.app.get("user");
    const token = await this.tokenService.findToken({ user: user.id });
    const data = await this.userService.getUserInfo(user);
    setCookie(req, res, token.refreshToken);
    return { status: StatusCodes.OK, data };
  }
  async getLatency(req: Request, res: Response) {
    const time = await getLatency("https://google.com");
    return { status: StatusCodes.OK, data: { time } };
  }
}

const userController = new UserController(
  new UserService(),
  new TokenService()
);
export default userController;
