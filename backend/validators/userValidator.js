import { body, param } from "express-validator";
import { dniValidator } from "./dniValidator.js";
import { emailValidator } from "./emailValidator.js";
import { passwordValidator } from "./passwordValidator.js";

export const registerUserValidator = [
  body("name").notEmpty().withMessage("Nombre requerido"),
  body("surname").notEmpty().withMessage("Apellidos requeridos"),
  emailValidator,
  passwordValidator,
  dniValidator,
  body("grade")
    .isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV"])
    .withMessage("Grado no válido"),
];

export const loginUserValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
];

export const verifyCodeValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos"),
];

export const resendVerificationValidator = [
  body("email").isEmail().withMessage("Email inválido"),
];

export const updateUserValidator = [
  body("name").optional().notEmpty(),
  body("surname").optional().notEmpty(),
  body("grade")
    .optional()
    .isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV"])
    .withMessage("Grado no válido"),
  body("rol")
    .optional()
    .isIn(["admin", "moderator", "user"])
    .withMessage("Rol no válido"),
  body("profileImage").optional().isString(),
];

export const userIdValidator = [
  param("id").isMongoId().withMessage("ID no válido"),
];
