import { check } from "express-validator";

const isTestMode = process.env.TEST_MODE === "true";

export const passwordValidator = isTestMode
  ? check("password").notEmpty().withMessage("Contraseña requerida (modo test)")
  : check("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      );
