import { check, param } from "express-validator";

export const createProjectValidator = [
  check("name").notEmpty().withMessage("El nombre es obligatorio"),
  check("contactPerson")
    .notEmpty()
    .withMessage("Persona de contacto obligatoria"),
  check("company").isIn(["U-TAD", "ILION", "OTROS"]),
  check("area").isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"]),
  check("description").notEmpty(),
  check("startDate").isISO8601(),
  check("endDate").isISO8601(),
  check("reviewDates").optional().isArray(),
  check("responsibles").optional().isArray(),
  check("users").optional().isArray(),
  check("benefit").optional().isString(),
  check("folder").optional().isString(),
  check("practicesAgreement").optional().isBoolean(),
  check("practicesStudents").optional().isInt({ min: 0 }),
  check("sdpStudents").optional().isInt({ min: 0 }),
];

export const updateProjectValidator = [
  check("name").optional().notEmpty(),
  check("contactPerson").optional().notEmpty(),
  check("company").optional().isIn(["U-TAD", "ILION", "OTROS"]),
  check("area")
    .optional()
    .isIn(["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"]),
  check("description").optional().notEmpty(),
  check("startDate").optional().isISO8601(),
  check("endDate").optional().isISO8601(),
  check("reviewDates").optional().isArray(),
  check("responsibles").optional().isArray(),
  check("users").optional().isArray(),
  check("benefit").optional().isString(),
  check("folder").optional().isString(),
  check("practicesAgreement").optional().isBoolean(),
  check("practicesStudents").optional().isInt({ min: 0 }),
  check("sdpStudents").optional().isInt({ min: 0 }),
];

export const projectIdValidator = [
  param("id").isMongoId().withMessage("ID de proyecto no válido"),
];
