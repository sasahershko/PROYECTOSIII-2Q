export function calculateBudget(budget) {
  const tutors = {
    numTutors: budget.tutors?.numTutors ?? 0,
    estimatedHours: budget.tutors?.estimatedHours ?? 0,
    pricePerHour: budget.tutors?.pricePerHour ?? 0,
  };
  tutors.subtotal = tutors.numTutors * tutors.estimatedHours * tutors.pricePerHour;
  budget.tutors = { ...budget.tutors, ...tutors };

  const interns = {
    numInterns: budget.interns?.numInterns ?? 0,
    estimatedHours: budget.interns?.estimatedHours ?? 0,
    pricePerHour: budget.interns?.pricePerHour ?? 0,
  };
  interns.subtotal = interns.numInterns * interns.estimatedHours * interns.pricePerHour;
  budget.interns = { ...budget.interns, ...interns };

  let totalExtras = 0;
  if (Array.isArray(budget.extraExpenses)) {
    budget.extraExpenses = budget.extraExpenses.map((gasto) => {
      const subtotal = (gasto.quantity || 0) * (gasto.unitPrice || 0);
      totalExtras += subtotal;
      return { ...gasto, subtotal };
    });
  } else {
    budget.extraExpenses = [];
  }

  budget.totalGeneral = tutors.subtotal + interns.subtotal + totalExtras;
}