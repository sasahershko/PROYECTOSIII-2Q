"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@lib/users";

export default function UserSelector({ selectedUsers, setSelectedUsers, label }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter((user) =>
        `${user.name} ${user.surname} ${user.email} ${user.dni}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const handleAddUser = (user) => {
    if (!selectedUsers.includes(user._id)) {
      setSelectedUsers([...selectedUsers, user._id]);
    }
    setSearch("");
    setFilteredUsers([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  return (
    <div className="mb-4 relative">
      <label className="block font-semibold mb-2 text-primary-text">{label}</label>

      {/* Input con icono */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-secundary-text"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="w-full border border-secundary-text rounded-lg p-2 pl-10 bg-primary-bg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          placeholder="Buscar usuario por nombre, email o DNI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Dropdown estilizado */}
      {filteredUsers.length > 0 && (
        <ul className="absolute z-20 w-full bg-card border border-secundary-text rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="p-3 hover:bg-primary-bg cursor-pointer transition-all border-b border-secundary-text/20 last:border-b-0"
              onClick={() => handleAddUser(user)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                  {user.name.charAt(0)}
                  {user.surname.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-primary-text">
                    {user.name} {user.surname}
                  </div>
                  {user.email && (
                    <div className="text-xs text-secundary-text">
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Usuarios seleccionados con mismo estilo que ProjectUserSelector */}
      <div className="mt-5">
        {selectedUsers.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-secundary-text mb-3">
              Usuarios seleccionados ({selectedUsers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u._id === userId);
                return user ? (
                  <div
                    key={user._id}
                    className="bg-primary-bg border border-secundary-text/30 p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                        {user.name.charAt(0)}
                        {user.surname.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-primary-text">
                          {user.name} {user.surname}
                        </div>
                        {user.email && (
                          <div className="text-sm text-secundary-text">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user._id)}
                      className="ml-2 flex-shrink-0 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors duration-200"
                      aria-label={`Eliminar ${user.name} ${user.surname}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
