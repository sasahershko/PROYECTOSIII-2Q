"use client";

import { getUsers } from "@lib/users";
import { useState, useEffect } from "react";
import UserCard from "@components/lists/UserCard";
import { AscIcon, DescIcon } from "@/components/svgs";

export default function Users() {
  const [mapaUsers, setMapaUsers] = useState([]);
  // Ordenamos por defecto por apellido
  const [sortBy, setSortBy] = useState("surname");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Función para recargar los usuarios
  const reloadUsers = () => {
    getUsers()
      .then((users) => {
        setMapaUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    reloadUsers();
  }, []);

  // Manejador de clic en un encabezado para ordenar
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Indicador visual del orden usando los íconos definidos
  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? AscIcon : DescIcon;
  };

  // Ordenamos normalizando a minúsculas
  const sortedUsers = [...mapaUsers].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const aNorm = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
    const bNorm = typeof bVal === "string" ? bVal.toLowerCase() : bVal;
    if (aNorm < bNorm) return sortOrder === "asc" ? -1 : 1;
    if (aNorm > bNorm) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Filtramos usuarios según el término de búsqueda en cualquier campo
  const filteredUsers = sortedUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    return Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(search)
    );
  });

  // Función para generar clases en los encabezados
  const headerClass = (column) =>
    `cursor-pointer flex items-center gap-1 hover:text-accent transition-colors ${
      sortBy === column ? "text-accent" : ""
    }`;

  // Manejador del input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col w-full items-center">
      {/* Buscador en la parte superior */}
      <div className="w-[95%] mt-4 max-w-8xl mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-text">
          Lista de Personas
        </h1>
        <div>
          <input
            type="text"
            placeholder="Buscar personas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="w-[95%] max-w-8xl bg-card shadow rounded-lg py-4 px-8 mb-4">
        {/* Fila de encabezados con items-center y py-2 */}
        <div
          className="grid gap-4 items-center font-semibold text-secundary-text border-b py-2"
          style={{
            gridTemplateColumns: "2fr 2fr 3fr 2fr 0.8fr 0.8fr 1fr",
          }}
        >
          <div
            className={headerClass("surname")}
            onClick={() => handleSort("surname")}
          >
            Apellido{renderSortIcon("surname")}
          </div>
          <div
            className={headerClass("name")}
            onClick={() => handleSort("name")}
          >
            Nombre{renderSortIcon("name")}
          </div>
          <div
            className={headerClass("email")}
            onClick={() => handleSort("email")}
          >
            Email{renderSortIcon("email")}
          </div>
          <div className={headerClass("dni")} onClick={() => handleSort("dni")}>
            DNI{renderSortIcon("dni")}
          </div>
          <div
            className={headerClass("grade")}
            onClick={() => handleSort("grade")}
          >
            Grado{renderSortIcon("grade")}
          </div>
          <div className={headerClass("rol")} onClick={() => handleSort("rol")}>
            Rol{renderSortIcon("rol")}
          </div>
          <div>Acciones</div>
        </div>

        {/* Render de cada usuario filtrado */}
        {filteredUsers.map((user) => (
          <UserCard key={user._id} user={user} reloadUsers={reloadUsers} />
        ))}
      </div>
    </div>
  );
}
