export default function GradeChip({ grado }) {
  const colorMap = {
    INSO: "bg-blue-400 text-white",
    MAIS: "bg-red-400 text-white",
    FIIS: "bg-green-400 text-white",
    DIPI: "bg-cyan-400 text-white",
    ANIV: "bg-yellow-400 text-white",
    DIDI: "bg-pink-400 text-white",
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
