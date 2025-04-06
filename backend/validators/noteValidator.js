import  validateResults  from "../utils/handleValidator.js"
import {check} from 'express-validator';

export const createNoteValidator = [
   check("note")
    .notEmpty()
    .withMessage("La nota es obligatoria"),
  check("userWhoRecieves")
    .optional()
    .isArray()
    .withMessage("userWhoRecieves debe ser un arreglo"),
  check("userWhoRecieves.*")
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
  check("noteIndex")
    .notEmpty()
    .withMessage("El índice de la nota es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El índice debe ser un entero no negativo"),
  check("note")
    .optional()
    .isLength({ min: 5 })
    .withMessage("La nota debe tener al menos 5 caracteres"),
  check("userWhoRecieves")
    .optional()
    .isArray()
    .withMessage("userWhoRecieves debe ser un arreglo"),
  check("userWhoRecieves.*")
    .optional()
    .isMongoId()
    .withMessage("Cada usuario debe ser un MongoID válido"),
  check("tag")
    .optional()
    .isIn(["completada", "no completada"])
    .withMessage("El tag debe ser 'completada' o 'no completada'"),
    validateResults
];


export const deleteNoteValidator= [
  check('noteIndex').isInt({ min: 0 }).withMessage('noteIndex debe ser un número entero'),
];