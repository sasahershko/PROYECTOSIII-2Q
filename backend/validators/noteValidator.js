import { validateResults} from "../utils/handleValidator.js"
import {check} from 'express-validator';

export const createNoteValidator = [
  check("projectId")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isMongoId()
    .withMessage("El ID del proyecto debe ser un MongoID válido"),
  check("note")
    .notEmpty()
    .withMessage("La nota es obligatoria")
    .isLength({ min: 5 })
    .withMessage("La nota debe tener al menos 5 caracteres"),
  check("userWhoWrites")
    .notEmpty()
    .withMessage("El usuario que escribe es obligatorio")
    .isMongoId()
    .withMessage("Debe ser un MongoID válido"),
  check("userWhoReceives")
    .optional()
    .isArray()
    .withMessage("userWhoReceives debe ser un arreglo"),
  check("userWhoReceives.*")
    .optional()
    .isMongoId()
    .withMessage("Cada usuario debe ser un MongoID válido"),
  check("tag")
    .optional()
    .isIn(["completada", "no completada"])
    .withMessage("El tag debe ser 'completada' o 'no completada'"),
    validateResults
];

export const updateNoteValidator = [
  check("projectId")
    .notEmpty()
    .withMessage("El ID del proyecto es obligatorio")
    .isMongoId()
    .withMessage("El ID del proyecto debe ser un MongoID válido"),
  check("noteIndex")
    .notEmpty()
    .withMessage("El índice de la nota es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El índice debe ser un entero no negativo"),
  check("note")
    .notEmpty()
    .withMessage("La nota es obligatoria")
    .isLength({ min: 5 })
    .withMessage("La nota debe tener al menos 5 caracteres"),
  check("userWhoWrites")
    .notEmpty()
    .withMessage("El usuario que escribe es obligatorio")
    .isMongoId()
    .withMessage("Debe ser un MongoID válido"),
  check("userWhoReceives")
    .optional()
    .isArray()
    .withMessage("userWhoReceives debe ser un arreglo"),
  check("userWhoReceives.*")
    .optional()
    .isMongoId()
    .withMessage("Cada usuario debe ser un MongoID válido"),
  check("tag")
    .optional()
    .isIn(["completada", "no completada"])
    .withMessage("El tag debe ser 'completada' o 'no completada'"),
    validateResults
];
