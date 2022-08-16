import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserDto from "../dtos/user.dto";
import TokenService from "../services/token.service";
import UserService from "../services/user.service";
import setCookie from "../utils/cookies";
import getLatency from "../utils/getLatency";
class UserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  //task says to extend token on every request i didnt understand if i need to increase token life or 
  //create another token one from that, it just confuses me, why do i need to increase token life
  //it is unsave,  if i stole token i can use it and every time it will be valid...
  async getInfo(req: Request, res: Response) {
    const user = req.app.get("user");
    const tokens = this.tokenService.generateTokens(new UserDto(user));
    const { accessToken, refreshToken } = await this.tokenService.saveToken({
      user: user.id,
      ...tokens,
    });
    const data = await this.userService.getUserInfo(user);
    setCookie(req, res, refreshToken);
    return { status: StatusCodes.OK, data: { userInfo: data, accessToken } };
  }

  //this function doesnt belong to user and it shuold be in another controller but i decided not to do
  //two controllers with only one method
  async getLatency(req: Request, res: Response) {
    try {
      const user = req.app.get("user");
      const tokens = this.tokenService.generateTokens(new UserDto(user));
      const { accessToken, refreshToken } = await this.tokenService.saveToken({
        user: user.id,
        ...tokens,
      });
      setCookie(req, res, refreshToken);
      const time = await getLatency("https://google.com");
      return {
        status: StatusCodes.OK,
        data: { time, tokens: { accessToken } },
      };
    } catch (err) {
      console.log(err);
    }
  }
}

const userController = new UserController(
  new UserService(),
  new TokenService()
);
export default userController;
