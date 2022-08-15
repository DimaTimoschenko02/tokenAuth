import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import ApiError from "../exeptions/api.error";
import { authSchema, validateEmailPhone } from "../schemas/auth.shemas";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if(schema === authSchema){
        req.body.id_type = validateEmailPhone(req.body.id)
      }
      return next();
    } catch (err: any) {
      return next( ApiError.BadRequest(err.message));
    }
  };

export default validate;
