"use client";

import { getUsers } from "@lib/users";
import { useState, useEffect } from "react";
import UserCard from "@components/lists/UserCard";
import { AscIcon, DescIcon } from "@/components/svgs";
import SpinLoader from "@components/SpinLoader";

export default function Users() {
  const [mapaUsers, setMapaUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("surname");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const reloadUsers = () => {
    setLoading(true);
    getUsers()
      .then((users) => {
        setMapaUsers(users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    reloadUsers();
  }, []);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? AscIcon : DescIcon;
  };

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

  const filteredUsers = sortedUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    return Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(search)
    );
  });

  const headerClass = (column) =>
    `cursor-pointer flex items-center gap-1 hover:text-accent transition-colors ${
      sortBy === column ? "text-accent font-semibold" : "font-normal"
    }`;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col w-full items-center min-h-screen bg-primary-bg text-primary-text">
      {/* Barra superior con título y buscador */}
      <div className="w-[95%] mt-4 max-w-8xl mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lista de Personas</h1>
        <div>
          <input
            type="text"
            placeholder="Buscar personas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-card border border-secundary-text text-primary-text placeholder-secundary-text rounded px-4 py-2 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Contenedor principal de la tabla */}
      <div className="w-[95%] max-w-8xl bg-card shadow-md rounded-lg mb-4 px-4">
        {/* Encabezados: mismo grid, gap y padding que las filas */}
        <div
          className="grid gap-4 items-center px-2 py-2 border-b"
          style={{ gridTemplateColumns: "2fr 2fr 3fr 2fr 0.8fr 0.8fr 1fr" }}
        >
          <div
            onClick={() => handleSort("surname")}
            className={headerClass("surname")}
          >
            Apellido{renderSortIcon("surname")}
          </div>
          <div
            onClick={() => handleSort("name")}
            className={headerClass("name")}
          >
            Nombre{renderSortIcon("name")}
          </div>
          <div
            onClick={() => handleSort("email")}
            className={headerClass("email")}
          >
            Email{renderSortIcon("email")}
          </div>
          <div onClick={() => handleSort("dni")} className={headerClass("dni")}>
            DNI{renderSortIcon("dni")}
          </div>
          <div
            onClick={() => handleSort("grade")}
            className={headerClass("grade")}
          >
            Grado{renderSortIcon("grade")}
          </div>
          <div onClick={() => handleSort("rol")} className={headerClass("rol")}>
            Rol{renderSortIcon("rol")}
          </div>
          <div className="font-semibold">Acciones</div>
        </div>

        {/* Contenido: Spinner o Tarjetas */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <SpinLoader />
          </div>
        ) : (
          <>
            {filteredUsers.map((user) => (
              <div key={user._id} className="animate-fadeIn">
                <UserCard user={user} reloadUsers={reloadUsers} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
