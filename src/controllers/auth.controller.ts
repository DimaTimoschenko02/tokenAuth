import { Request, Response } from "express";
import bcrypt from "bcrypt";
import AuthService from "../services/auth.service";

import config from "config";
import TokenService from "../services/token.service";

import { decode, sign } from "../utils/jwt.utils";
import UserDto from "../dtos/user.dto";
import { get, omit } from "lodash";

class AuthController {
  expiresIn: string;
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.expiresIn = config.get("jwtExpiration") as string;
  }
  async signin(req: Request, res: Response) {
    let decoded;
    const { body } = req;
    const user = await this.authService.find(body.id);

    const data = await this.tokenService.findToken({ id: user.id });
    if (data) {
      decoded = await this.tokenService.validateAccessToken(data.accessToken);
    }
    if (!decoded) {
      const userDto = new UserDto(user);
      const { accessToken, refreshToken } =
        this.tokenService.generateTokens(userDto);
      const token = await this.tokenService.saveToken({
        user: user.id,
        accessToken,
        refreshToken,
      });
      res.cookie("refreshToken", refreshToken, {
        //expires:10 * 24 * 60 * 60 * 1000,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return {
        status: 200,
        data: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      };
    }

    return { status: 200, data: { accessToken: data.accessToken } };
  }

  async signup(req: Request, res: Response) {
    const { body } = req;
    const hashPassword = bcrypt.hashSync(body.password, 5);
    const user = await this.authService.create({
      ...body,
      password: hashPassword,
    });

    const userDto = new UserDto(user);
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(userDto);

    await this.tokenService.saveToken({
      user: user.id,
      refreshToken,
      accessToken,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { status: 201, data: { accessToken, refreshToken } };
  }

  async logout(req: Request, res: Response) {
    //const token = req.app.get("token");
    const { all } = req.params;
    const refreshToken = get(req.cookies, "refreshToken");
    res.clearCookie("refreshToken");
    if (all === "true") {
      await this.tokenService.removeAllTokens();
      return { status: 200, data: "All tokens removed" };
    }
    const token = await this.tokenService.removeToken(refreshToken);
    return { status: 200, data: token };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = get(req.cookies, "refreshToken");
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie("refreshToken",tokens.refreshToken, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return {status:200 , data:{tokens}}
  }
}

const authController = new AuthController(
  new AuthService(new TokenService()),
  new TokenService()
);
export default authController;
