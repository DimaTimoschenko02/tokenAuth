import { Router } from "express";
import authController from "../../controllers/auth.controller";
import {
  tryCatchMiddleware,
  isExistMiddleware,
  validateSchema,
  comparePassword,
  authMiddleware,
} from "../../middleware";
import { authSchema, logoutSchema } from "../../schemas/auth.shemas";

const router: Router = Router();

router.post(
  "/sign-up",
  [validateSchema(authSchema), isExistMiddleware(true)],
  tryCatchMiddleware(authController.signup.bind(authController))
);
router.post(
  "/sign-in",
  [validateSchema(authSchema), isExistMiddleware(false), comparePassword()],
  tryCatchMiddleware(authController.signin.bind(authController))
);

router.get(
  "/logout/:all",
  [validateSchema(logoutSchema), authMiddleware()],
  tryCatchMiddleware(authController.logout.bind(authController))
);
router.get('/refresh' , tryCatchMiddleware(authController.refresh.bind(authController)) )

export default router;
