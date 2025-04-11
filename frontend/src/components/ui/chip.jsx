export default function GradeChip({ grado }) {
  const colorMap = {
    INSO: "bg-blue-100 text-black",
    MAIS: "bg-blue-100 text-black",
    FIIS: "bg-blue-100 text-black",
    DIPI: "bg-purple-100 text-black",
    ANIV: "bg-yellow-100 text-black",
  };

  const styles = colorMap[grado] || "bg-gray-100 text-gray-800";

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (grado === "null") {
    return (
      <span
        className={`px-[12px] py-[4px] rounded-full text-sm font-medium bg-transparent`}
      >
        <span className="text-gray-500">&nbsp;</span>
      </span>
    );
  }

  return (
    <span
      className={`px-[12px] py-[4px] rounded-full text-sm font-medium ${styles}`}
    >
      {capitalize(grado)}
    </span>
  );
}
