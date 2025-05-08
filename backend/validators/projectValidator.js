import { check, param } from "express-validator";
import { matchedData } from "express-validator";
import validateRequest from "../utils/handleValidator.js";

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
    .trim()
    .withMessage("El título debe ser un texto."),

  check("budget.reason")
    .optional()
    .isString()
    .trim()
    .withMessage("El motivo debe ser un texto."),

  check("budget.generalComments")
    .optional()
    .isString()
    .trim()
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
    .not()
    .exists()
    .withMessage("El subtotal de tutores se calcula automáticamente."),

  check("budget.interns.numInterns")
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      "El número de estudiantes en prácticas debe ser un entero positivo."
    ),

  check("budget.interns.estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "Las horas estimadas para prácticas deben ser un número positivo."
    ),

  check("budget.interns.pricePerHour")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "El precio por hora en prácticas debe ser un número positivo."
    ),

  check("budget.interns.subtotal")
    .not()
    .exists()
    .withMessage("El subtotal de prácticas se calcula automáticamente."),

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
    .withMessage(
      "El precio unitario del gasto extra debe ser un número positivo."
    ),

  check("budget.extraExpenses.*.subtotal")
    .not()
    .exists()
    .withMessage("El subtotal del gasto extra se calcula automáticamente."),

  check("budget.totalGeneral")
    .not()
    .exists()
    .withMessage("El total general se calcula automáticamente."),

  // Middleware final para limpiar y validar
  (req, res, next) => {
    req.filteredData = matchedData(req, { locations: ["body"] });
    validateRequest(req, res, next);
  },
];

export const validateProjectUsersUpdate = [
  param("id").isMongoId().withMessage("ID de proyecto no válido"),

  check("users")
    .optional()
    .isArray()
    .withMessage("users debe ser un array de IDs"),

  check("users.*")
    .optional()
    .isMongoId()
    .withMessage("Cada ID en users debe ser un ObjectId válido"),

  check("responsibles")
    .optional()
    .isArray()
    .withMessage("responsibles debe ser un array de IDs"),

  check("responsibles.*")
    .optional()
    .isMongoId()
    .withMessage("Cada ID en responsibles debe ser un ObjectId válido"),
];
