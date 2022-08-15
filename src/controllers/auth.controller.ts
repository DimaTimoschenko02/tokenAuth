import { Request, Response } from "express";
import bcrypt from "bcrypt";
import AuthService from "../services/auth.service";
import config from "config";
import TokenService from "../services/token.service";
import UserDto from "../dtos/user.dto";
import { get } from "lodash";
import { IUserDocument } from "../models/user.model";
import setCookie from '../utils/cookies'
class AuthController {
  expiresIn: string;
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.expiresIn = config.get("jwtExpiration") as string;
  }
  async signin(req: Request, res: Response) {
    let decoded: IUserDocument | null;
    const { body } = req;
    const user = await this.authService.find(body.id);

    const data = await this.tokenService.findToken({ id: user.id });
    if (data) {
      decoded = await this.tokenService.validateAccessToken(data.accessToken);
    }
    if (!decoded) {
      const userDto = new UserDto(user);
      const { accessToken, refreshToken } = this.tokenService.generateTokens(userDto);
      const token = await this.tokenService.saveToken({
        user: user.id,
        accessToken,
        refreshToken,
      });
      setCookie(req, res , token.refreshToken)
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
    setCookie(req, res , refreshToken)
    return { status: 201, data: { accessToken, refreshToken } };
  }

  async logout(req: Request, res: Response) {
    
    const { all } = req.params;
    const refreshToken = get(req.cookies, "refreshToken");
    res.clearCookie("refreshToken");
    if (all === "true") {
      const token = await this.tokenService.removeAllTokens();
      return { status: 200, data: token };
    }
    const token = await this.tokenService.removeToken(refreshToken);
    return { status: 200, data: token };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = get(req.cookies, "refreshToken");
    const tokens = await this.authService.refresh(refreshToken);
    setCookie(req, res , refreshToken)
    return { status: 200, data: { tokens } };
  }
}

const authController = new AuthController(
  new AuthService(new TokenService()),
  new TokenService()
);
export default authController;
