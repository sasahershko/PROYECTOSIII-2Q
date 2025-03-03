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
  

  export const getUpcomingReviewDate = (reviewDates) => {
    if (!reviewDates || !Array.isArray(reviewDates) || reviewDates.length === 0) {
      return "Sin revisiones";
    }
  
    // Convertimos a Date asegurándonos de que reviewDates es un array de strings
    let upcomingReviewDate = reviewDates
      .filter(date => !!date) // Evitar valores `null` o `undefined`
      .map(date => new Date(date)) // Convertir strings en objetos Date
      .sort((a, b) => a - b) // Ordenar de más antigua a más nueva
      .find(date => isAfter(date, new Date())); // Buscar la próxima fecha futura
  
    // Si no hay fechas futuras, devolver la última revisión disponible
    if (!upcomingReviewDate && reviewDates.length > 0) {
      upcomingReviewDate = new Date(reviewDates[reviewDates.length - 1]);
    }
  
    return upcomingReviewDate ? upcomingReviewDate.toISOString() : "Sin revisiones";
  };
  
  // 📌 Función que genera las fechas del proyecto con sus íconos
  export const getProjectDates = (project) => {
    const upcomingReviewDate = getUpcomingReviewDate(project.reviewDates);
  
    return [
      { icon: "calendar", date: new Date(project.startDate).toISOString().split("T")[0] },
      { icon: "clock", date: upcomingReviewDate !== "Sin revisiones" ? new Date(upcomingReviewDate).toISOString().split("T")[0] : "Sin revisiones" },
      { icon: "hourglass", date: new Date(project.endDate).toISOString().split("T")[0] }
    ];
  };
  