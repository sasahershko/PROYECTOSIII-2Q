import { check } from "express-validator";
import validateResults from "../utils/handleValidator.js";

export const validatorCreateTable = [
    check("number")
        .exists().notEmpty()
        .isInt({ min: 1 }).withMessage("El número de mesa debe ser un número entero positivo"),
    
    check("zone")
        .exists()
        .notEmpty()
        .isString().withMessage("La zona debe ser un texto"),

    check("capacity")
        .exists()
        .notEmpty()
        .isInt({ min: 1 }).withMessage("La capacidad debe ser un número entero positivo"),

    validateResults
];
