export default function GradeChip({ grado }) {
  const colorMap = {
    INSO: "bg-blue-100 text-black",
    MAIS: "bg-blue-100 text-black",
    FIIS: "bg-blue-100 text-black",
    DIPI: "bg-purple-100 text-black",
    ANIV: "bg-yellow-100 text-black",
  };

  const styles = colorMap[grado] || "bg-gray-100 text-gray-800";

  const capitalize = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <span
      className={`px-[12px] py-[4px] rounded-full text-sm font-medium ${styles}`}
    >
      {capitalize(grado)}
    </span>
  );
}
