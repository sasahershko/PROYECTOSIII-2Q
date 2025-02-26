import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date) => {
    if (!date || typeof date !== "string" || date === "Sin revisiones") return date; //no formatear si no es una fecha válida
  
    try {
      return format(new Date(date), "dd MMM yyyy", { locale: es });
    } catch (error) {
      console.error("❌ Error formateando fecha:", date, error);
      return "Fecha inválida";
    }
  };
  

// 📌 Obtiene la fecha de revisión más próxima
export const getUpcomingReviewDate = (reviewDates) => {
  if (!reviewDates || !Array.isArray(reviewDates)) return "Sin revisiones";

  let upcomingReviewDate = reviewDates
    .filter(Boolean) // Evitar valores `undefined`
    .map(r => r.date)
    .sort((a, b) => new Date(a) - new Date(b)) // Ordenar de más antigua a más nueva
    .find(date => isAfter(new Date(date), new Date())); // Tomar la más próxima

  if (!upcomingReviewDate && reviewDates.length > 0) {
    upcomingReviewDate = reviewDates[reviewDates.length - 1].date;
  }

  return upcomingReviewDate || "Sin revisiones";
};

// 📌 Crea el array de fechas con sus íconos
export const getProjectDates = (project) => {
  const upcomingReviewDate = getUpcomingReviewDate(project.reviewDates);

  return [
    { icon: "calendar", date: project.startDate },
    { icon: "clock", date: upcomingReviewDate },
    { icon: "hourglass", date: project.endDate }
  ];
};
