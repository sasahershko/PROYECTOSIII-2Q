import Link from "next/link";
import { format } from "date-fns";
import { BsCalendar, BsClockHistory, BsHourglassSplit } from "react-icons/bs";
import Image from "next/image";

export default function ProjectCard({ project }) {
  const {
    _id,
    name,
    company,
    category,
    startDate,
    midDate,
    endDate,
    users,
    pStatus,
  } = project;

  const currentStatus = pStatus?.[0]?.status || "Sin estado";

  const start = startDate ? format(new Date(startDate), "dd MMM yyyy") : "";
  const mid = midDate ? format(new Date(midDate), "dd MMM yyyy") : "";
  const end = endDate ? format(new Date(endDate), "dd MMM yyyy") : "";

  let statusClasses = "bg-gray-200 text-gray-700";
  if (currentStatus === "En curso") {
    statusClasses = "bg-yellow-100 text-yellow-800";
  } else if (currentStatus === "No iniciado") {
    statusClasses = "bg-gray-100 text-gray-800";
  } else if (currentStatus === "En espera") {
    statusClasses = "bg-orange-100 text-orange-800";
  }

  return (
    <Link href={`/projects/${_id}`}>
      {/* 
        Añade "cursor-pointer" o estilos hover 
        para indicar que es clicable
      */}
      <div className="flex items-center justify-between bg-primary-bg rounded-md shadow px-4 py-2 gap-2 cursor-pointer hover:shadow-md transition-shadow">
        {/* Nombre del proyecto */}
        <div className="text-sm font-semibold text-primary-text w-56">
          {name}
        </div>

        {/* Empresa */}
        <div className="flex items-center gap-1 justify-start">
          <div className="border-[1px] mt-1 border-primary-text h-[30px] w-20 rounded-md flex items-center justify-center gap-1 scale-90">
            <Image
              src={"/icons/organization.svg"}
              alt="organization"
              width={15}
              height={15}
              className="text-primary-text"
            ></Image>
            <p className="text-base sm:text-sm md:text-xs">{project.company}</p>
          </div>
        </div>

        {/* Categoría */}
        {category && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 text-pink-800">
            {category}
          </span>
        )}

        {/* Fechas */}
        <div className="flex items-center gap-4">
          {start && (
            <div className="flex items-center gap-1 text-sm text-secundary-text">
              <BsCalendar className="text-xs" />
              {start}
            </div>
          )}
          {mid && (
            <div className="flex items-center gap-1 text-sm text-secundary-text">
              <BsClockHistory className="text-xs" />
              {mid}
            </div>
          )}
          {end && (
            <div className="flex items-center gap-1 text-sm text-secundary-text">
              <BsHourglassSplit className="text-xs" />
              {end}
            </div>
          )}
        </div>

        {/* Participantes */}
        <div className="flex -space-x-2">
          {users?.map((u) => (
            <div
              key={u._id}
              className="w-8 h-8 rounded-full border-2 border-primary-bg bg-gray-300 flex items-center justify-center text-xs font-semibold"
              title={`${u.name} ${u.surname}`}
            >
              {u.name?.[0]?.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Estado */}
        <div className={`text-xs px-2 py-1 rounded-full ${statusClasses}`}>
          {currentStatus}
        </div>
      </div>
    </Link>
  );
}
