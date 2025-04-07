import { check } from "express-validator";
import validateResults from "../utils/handleValidator.js";

export const validatorCreateReservation = [
    check("table")
        .exists().notEmpty()
        .isMongoId().withMessage("El ID de la mesa es inválido"),

    check("project")
        .exists().notEmpty()
        .isMongoId().withMessage("El ID del proyecto es inválido"),

    check("date")
        .exists().notEmpty()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Formato de fecha inválido (YYYY-MM-DD)"),

    check("startTime")
        .exists().notEmpty()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Formato de hora inválido (HH:MM)"),

    check("endTime")
        .exists().notEmpty()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Formato de hora inválido (HH:MM)"),

    check("startTime").custom((value, { req }) => {
        if (value >= req.body.endTime) {
            throw new Error("La hora de inicio debe ser antes que la hora de fin");
        }
        return true;
    }),

    validateResults
];
