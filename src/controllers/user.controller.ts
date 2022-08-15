import { Request, Response } from "express";
import UserService from "../services/user.service";

class UserController {
  constructor(private userService: UserService) {}
  async getInfo(req: Request, res: Response) {
    const user = req.app.get('user')
    console.log(user)
    const data = await this.userService.getUserInfo(user)
    return {status:200 , data}
  }
}

const userController = new UserController(new UserService());
export default userController;
