import { validationResult, matchedData } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extrae solo los datos validados por express-validator
  req.filteredData = matchedData(req, {
    locations: ["body", "params", "query"],
  });
  next();
};
