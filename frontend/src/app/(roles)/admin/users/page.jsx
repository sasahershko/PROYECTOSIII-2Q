"use client";

import { useState, useEffect } from "react";
import { getUsers } from "@lib/users";
import UserCard from "@components/lists/UserCard";
import SpinLoader from "@components/SpinLoader";
import { AnimatePresence, motion } from "framer-motion";
import { LuFilter, LuAArrowUp, LuAArrowDown, LuSearch } from "react-icons/lu";

const areaColors = {
  INSO: "bg-blue-400",
  MAIS: "bg-red-400",
  FIIS: "bg-green-400",
  DIPI: "bg-cyan-400",
  ANIV: "bg-yellow-400",
};

const rolColors = {
  user: "bg-gray-500",
  admin: "bg-gray-500",
};

export default function Users() {
  const [mapaUsers, setMapaUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("surname");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState([]);
  const [filterRol, setFilterRol] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12; //numero de usuarios por página

  const reloadUsers = () => {
    setLoading(true);
    getUsers()
      .then((users) => setMapaUsers(users))
      .catch((error) => console.error("Error fetching users:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadUsers();
  }, []);

  const handleSort = (column) => {
    if (column !== "name" && column !== "surname") return;
    if (sortBy === column) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <LuAArrowUp className="w-4 h-4 inline-block" />
    ) : (
      <LuAArrowDown className="w-4 h-4 inline-block" />
    );
  };

  // Ordenar
  const sortedUsers = [...mapaUsers].sort((a, b) => {
    const aVal = a[sortBy]?.toString().toLowerCase() || "";
    const bVal = b[sortBy]?.toString().toLowerCase() || "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Filtrar
  const filteredUsers = sortedUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = Object.values(user).some((v) =>
      v?.toString().toLowerCase().includes(search)
    );
    const matchesGrade =
      filterGrade.length > 0 ? filterGrade.includes(user.grade) : true;
    const matchesRol =
      filterRol.length > 0 ? filterRol.includes(user.rol) : true;
    return matchesSearch && matchesGrade && matchesRol;
  });

  // Resetear página al cambiar filtros o búsqueda
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterGrade, filterRol]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const toggleFilter = (value, setter, current) =>
    setter(
      current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value]
    );

  const removeChip = (value, setter, current) =>
    setter(current.filter((x) => x !== value));

  const headerClass = (col) =>
    `select-none cursor-pointer flex items-center gap-1 hover:text-accent transition-colors ${
      sortBy === col ? "text-accent font-semibold" : "font-normal"
    }`;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal-background")) {
      setShowFilters(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center min-h-screen bg-primary-bg text-primary-text">
      {/* Top bar */}
      <div className="w-[95%] max-w-8xl mt-8 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold select-none">Lista de Personas</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative group">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secundary-text group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Buscar personas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-2 border-secundary-text text-primary-text placeholder-secundary-text rounded px-10 py-2 focus:outline-none focus:border-accent h-10 w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="text-primary-text select-none hover:scale-105 transition duration-150 p-2 rounded-full"
          >
            <LuFilter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      <div className="w-[95%] max-w-8xl mb-2 flex flex-wrap gap-2 px-4">
        {[
          ...filterGrade.map((g) => ({
            label: g,
            color: areaColors[g] || "bg-gray-400",
            remove: () => removeChip(g, setFilterGrade, filterGrade),
          })),
          ...filterRol.map((r) => ({
            label: r,
            color: rolColors[r] || "bg-gray-400",
            remove: () => removeChip(r, setFilterRol, filterRol),
          })),
        ].map((chip) => (
          <div
            key={chip.label}
            onClick={chip.remove}
            className={`${chip.color} text-white rounded-full px-3 py-1 text-sm gap-2 flex items-center cursor-pointer select-none`}
          >
            <span>{chip.label}</span>
            <span className="font-bold">×</span>
          </div>
        ))}
      </div>

      {/* Contador de resultados */}
      <div className="w-[95%] max-w-8xl mb-4 px-4 text-sm text-secundary-text">
        Mostrando {filteredUsers.length} de {mapaUsers.length}
      </div>

      {/* Filters modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 z-40 flex items-start justify-end modal-background"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-lg p-6 w-64 shadow-xl mt-44 mr-8 select-none"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-secundary-text select-none">
                  Filtros
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-2xl font-bold text-gray-500 hover:text-gray-700 select-none"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 select-none">Grado</h4>
                <div className="flex flex-col gap-2">
                  {Object.keys(areaColors).map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={filterGrade.includes(g)}
                        onChange={() =>
                          toggleFilter(g, setFilterGrade, filterGrade)
                        }
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 select-none">Rol</h4>
                <div className="flex flex-col gap-2">
                  {Object.keys(rolColors).map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={filterRol.includes(r)}
                        onChange={() =>
                          toggleFilter(r, setFilterRol, filterRol)
                        }
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setFilterGrade([]);
                    setFilterRol([]);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 select-none"
                >
                  Limpiar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users table */}
      <div className="w-[95%] max-w-8xl bg-card shadow-md rounded-lg mb-4 px-4">
        <div
          className="grid gap-4 items-center px-2 py-2 border-b"
          style={{
            gridTemplateColumns: "0.25fr 2fr 2fr 3fr 2fr 0.8fr 0.8fr 1fr",
          }}
        >
          <div className="select-none">&nbsp;</div>
          <div
            onClick={() => handleSort("surname")}
            className={headerClass("surname")}
          >
            Apellido {renderSortIcon("surname")}
          </div>
          <div
            onClick={() => handleSort("name")}
            className={headerClass("name")}
          >
            Nombre {renderSortIcon("name")}
          </div>
          <div className="select-none">Email</div>
          <div className="select-none">DNI</div>
          <div className="select-none">Grado</div>
          <div className="select-none">Rol</div>
          <div className="select-none">Acciones</div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <SpinLoader />
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center text-secundary-text font-medium py-8">
            No se encuentran usuarios para tus filtros.
          </div>
        ) : (
          <AnimatePresence>
            {paginatedUsers.map((user, idx) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <UserCard user={user} reloadUsers={reloadUsers} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-card rounded disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-accent text-white"
                  : "bg-card hover:bg-secundary-text/30"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-card rounded disabled:opacity-50 hover:bg-secundary-text/30"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
