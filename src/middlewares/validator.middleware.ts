import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import appError from "../utils/appError.utils";
export const validate = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    //! if error
    if (!result.success) {
      const errors = result.error.issues.map(({ message, path }) => {
        return { path: path.join("."), message };
      });
      return next(new appError("validation error", 400, errors));
    }
//* if validation success
    req.body = result.data.body;
    req.params = result.data.params as Record<string, any>;
    Object.assign(req.query, result.data.query )
    next();
    

  };

};
