import { check } from "express-validator";

export const passwordValidator = check("password")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
  .withMessage(
    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
  );
