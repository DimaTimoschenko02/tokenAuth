import { Request, Response } from "express";
import config from 'config'
export default async (req: Request, res: Response , refreshToken:string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: config.get('jwtExpirationRefresh') as number * 1000,
    httpOnly: true,
  });
};
