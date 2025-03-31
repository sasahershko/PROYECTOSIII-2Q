import { body, param } from "express-validator";

export const createProjectValidator = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("contactPerson")
    .notEmpty()
    .withMessage("Persona de contacto obligatoria"),
  body("company").isIn(["U-TAD", "ILION", "OTROS"]),
  body("area").isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"]),
  body("description").notEmpty(),
  body("startDate").isISO8601(),
  body("endDate").isISO8601(),
  body("reviewDates").optional().isArray(),
  body("responsibles").optional().isArray(),
  body("users").optional().isArray(),
  body("benefit").optional().isString(),
  body("folder").optional().isString(),
  body("practicesAgreement").optional().isBoolean(),
  body("practicesStudents").optional().isInt({ min: 0 }),
  body("sdpStudents").optional().isInt({ min: 0 }),
];

export const updateProjectValidator = [
  body("name").optional().notEmpty(),
  body("contactPerson").optional().notEmpty(),
  body("company").optional().isIn(["U-TAD", "ILION", "OTROS"]),
  body("area")
    .optional()
    .isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"]),
  body("description").optional().notEmpty(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("reviewDates").optional().isArray(),
  body("responsibles").optional().isArray(),
  body("users").optional().isArray(),
  body("benefit").optional().isString(),
  body("folder").optional().isString(),
  body("practicesAgreement").optional().isBoolean(),
  body("practicesStudents").optional().isInt({ min: 0 }),
  body("sdpStudents").optional().isInt({ min: 0 }),
];

export const projectIdValidator = [
  param("id").isMongoId().withMessage("ID de proyecto no válido"),
];
