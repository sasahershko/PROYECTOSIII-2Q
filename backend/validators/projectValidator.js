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

export const budgetValidator = [
  check("budget.title")
    .optional()
    .isString()
    .withMessage("El título debe ser un texto."),

  check("budget.reason")
    .optional()
    .isString()
    .withMessage("El motivo debe ser un texto."),

  check("budget.generalComments")
    .optional()
    .isString()
    .withMessage("Los comentarios deben ser un texto."),

  check("budget.tutors.numTutors")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El número de tutores debe ser un entero positivo."),

  check("budget.tutors.estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Las horas estimadas deben ser un número positivo."),

  check("budget.tutors.pricePerHour")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio por hora debe ser un número positivo."),

  check("budget.tutors.subtotal")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El subtotal de tutores debe ser un número positivo."),

  check("budget.interns.numInterns")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El número de estudiantes en prácticas debe ser un entero positivo."),

  check("budget.interns.estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Las horas estimadas para prácticas deben ser un número positivo."),

  check("budget.interns.pricePerHour")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio por hora en prácticas debe ser un número positivo."),

  check("budget.interns.subtotal")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El subtotal de prácticas debe ser un número positivo."),

  check("budget.extraExpenses")
    .optional()
    .isArray()
    .withMessage("Los gastos extra deben estar en un array."),

  check("budget.extraExpenses.*.description")
    .optional()
    .isString()
    .withMessage("La descripción del gasto extra debe ser un texto."),

  check("budget.extraExpenses.*.quantity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La cantidad del gasto extra debe ser un número positivo."),

  check("budget.extraExpenses.*.unitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio unitario del gasto extra debe ser un número positivo."),

  check("budget.extraExpenses.*.subtotal")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El subtotal del gasto extra debe ser un número positivo."),

  check("budget.totalGeneral")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El total general debe ser un número positivo."),
];