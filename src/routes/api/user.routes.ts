import { Router } from "express";
import userController from "../../controllers/user.controller";
import { authMiddleware, tryCatchMiddleware } from "../../middleware";
const router: Router = Router();

router.get(
  "/info",
  [authMiddleware],
  tryCatchMiddleware(userController.getInfo.bind(userController) , true)
);
export default router;
