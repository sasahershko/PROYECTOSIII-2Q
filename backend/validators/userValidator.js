import { check, body, param } from "express-validator";
import { dniValidator } from "./dniValidator.js";
import { emailValidator } from "./emailValidator.js";
import { passwordValidator } from "./passwordValidator.js";

export const registerUserValidator = [
  check("name").notEmpty().withMessage("Nombre requerido"),
  check("surname").notEmpty().withMessage("Apellidos requeridos"),
  emailValidator,
  passwordValidator,
  dniValidator,
  check("grade")
    .isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV"])
    .withMessage("Grado no válido"),
];

export const loginUserValidator = [
  check("email").isEmail().withMessage("Email inválido"),
  check("password").notEmpty().withMessage("Contraseña requerida"),
];

export const verifyCodeValidator = [
  check("email").isEmail().withMessage("Email inválido"),
  check("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos"),
];

export const resendVerificationValidator = [
  check("email").isEmail().withMessage("Email inválido"),
];

export const updateUserValidator = [
  // Campos editables
  check("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  check("surname")
    .optional()
    .notEmpty()
    .withMessage("Los apellidos no pueden estar vacíos"),
  check("grade")
    .optional()
    .isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV"])
    .withMessage("Grado no válido"),
  check("rol")
    .optional()
    .isIn(["admin", "moderator", "user"])
    .withMessage("Rol no válido"),
  check("profileImage")
    .optional()
    .isString()
    .withMessage("La imagen debe ser una URL o string"),
  dniValidator.optional(),

  // Campos no editables
  body("email").not().exists().withMessage("No se puede modificar el correo"),
  body("password")
    .not()
    .exists()
    .withMessage("No se puede modificar la contraseña"),
];

export const userIdValidator = [
  param("id").isMongoId().withMessage("ID no válido"),
];
