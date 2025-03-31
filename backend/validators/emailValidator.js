import { body } from "express-validator";

export const emailValidator = body("email")
  .isEmail()
  .withMessage("Formato de email inválido")
  .matches(/@u-tad\.com$|@live\.u-tad\.com$/)
  .withMessage("Solo se permiten emails de U-TAD");
