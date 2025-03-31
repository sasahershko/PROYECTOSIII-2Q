const validateProjectData = (req, res, next) => {
  const {
    name,
    contactPerson,
    company,
    area,
    description,
    startDate,
    endDate,
    practicesStudents,
    sdpStudents,
  } = req.body;

  if (
    !name ||
    !contactPerson ||
    !company ||
    !area ||
    !description ||
    !startDate ||
    !endDate
  ) {
    return res
      .status(400)
      .json({
        mensaje: "Todos los campos obligatorios deben estar completos.",
      });
  }

  const allowedCompanies = ["U-TAD", "ILION", "OTROS"];
  const allowedAreas = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"];

  if (!allowedCompanies.includes(company)) {
    return res
      .status(400)
      .json({ mensaje: "La empresa seleccionada no es válida." });
  }

  if (!allowedAreas.includes(area)) {
    return res
      .status(400)
      .json({ mensaje: "El área seleccionada no es válida." });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res
      .status(400)
      .json({
        mensaje:
          "La fecha de inicio no puede ser mayor que la de finalización.",
      });
  }

  if (practicesStudents < 0 || sdpStudents < 0) {
    return res
      .status(400)
      .json({ mensaje: "Los números de alumnos no pueden ser negativos." });
  }

  next();
};

export default validateProjectData;
