import { Request, Response } from "express";

export default async (req: Request, res: Response , refreshToken:string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};
