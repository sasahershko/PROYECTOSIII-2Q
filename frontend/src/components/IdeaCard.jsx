// components/IdeaCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";

const areaColors = {
  INSO: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/80",
    shadow: "shadow-lg",
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  MAIS: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/80",
    shadow: "shadow-lg",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  FIIS: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/80",
    shadow: "shadow-lg",
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  DIPI: {
    bg: "bg-gradient-to-br from-rose-50 to-rose-100/80",
    shadow: "shadow-lg",
    badge: "bg-rose-100 text-rose-700 border border-rose-200",
  },
  ANIV: {
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/80",
    shadow: "shadow-lg",
    badge: "bg-violet-100 text-violet-700 border border-violet-200",
  },
  DIDI: {
    bg: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100/80",
    shadow: "shadow-lg",
    badge: "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
  },
};

const defaultStyle = {
  bg: "bg-[#f5f5f5]",
  shadow: "shadow-lg",
  badge: "bg-slate-100 text-slate-800 border border-slate-200",
};

export default function IdeaCard({ idea, rotationClass }) {
  // Log props passed to IdeaCard
  console.log("IdeaCard props:", { idea, rotationClass });

  const style = areaColors[idea.grado] || defaultStyle;

  // Helper to get initials from name and surname
  const getInitials = (first = "", last = "") => {
    const firstInitial = first ? first[0].toUpperCase() : "";
    const lastInitial = last ? last[0].toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const user = idea.usuario || {};
  const {
    name = null,
    surname = null,
    profileImage = null,
    email = null,
  } = user;
  const displayName =
    name || surname
      ? `${name || ""}${name && surname ? " " : ""}${surname || ""}`
      : "Desconocido";

  return (
    <Link
      href={`/admin/ideas/${idea._id}`}
      className={`group flex flex-col h-full relative transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:scale-[1.02]`}
    >
      <div
        className={`${style.bg} ${style.shadow} ${rotationClass} p-6 flex flex-col h-full rounded-sm transition-all duration-300 overflow-hidden relative`}
      >
        {/* Chincheta simulada como círculo rojo más oscuro y sombra pronunciada */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 h-4 w-4 bg-red-600 rounded-full shadow-2xl ring-2 ring-black/30"></div>

        {/* Badge */}
        <div className="mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md ${style.badge} transition-all duration-300 shadow-sm`}
          >
            {idea.grado || "General"}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-semibold text-xl text-slate-800 mb-3 transition-all duration-300 line-clamp-2 font-[system-ui]">
          {idea.nombre}
        </h2>

        {/* Description */}
        <p className="text-slate-700 line-clamp-3 mb-6 flex-grow text-sm leading-relaxed font-[system-ui]">
          {idea.descripcion}
        </p>

        {/* Footer: user */}
        <div className="flex items-center mt-auto pt-4 border-t border-slate-300/30 transition-colors duration-300">
          <div className="relative h-8 w-8 mr-3">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={displayName || email || "Usuario"}
                width={32}
                height={32}
                className="rounded-full shadow-sm"
              />
            ) : (
              <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-slate-700">
                  {getInitials(name, surname)}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-slate-700 font-medium">
            {displayName}
          </span>
        </div>
      </div>
    </Link>
  );
}

IdeaCard.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    grado: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    usuario: PropTypes.shape({
      name: PropTypes.string,
      surname: PropTypes.string,
      profileImage: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
  rotationClass: PropTypes.string,
};

IdeaCard.defaultProps = {
  rotationClass: "",
};
