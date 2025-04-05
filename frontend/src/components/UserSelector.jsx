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
    <div className="mb-2 relative">
      <label className="block font-semibold mb-2 text-primary-text">{label}</label>
      <input
        type="text"
        className="w-full border border-secundary-text rounded-lg p-2 bg-primary-bg focus:outline-none focus:ring-2 focus:ring-accent"
        placeholder="Buscar usuario por nombre, email o DNI"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
  
      {filteredUsers.length > 0 && (
        <ul className="absolute z-20 w-full bg-card border border-secundary-text rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="p-3 hover:bg-primary-bg cursor-pointer transition-all"
              onClick={() => handleAddUser(user)}
            >
              <div className="text-sm font-medium text-primary-text">
                {user.name} {user.surname}
              </div>
              <div className="text-xs text-secundary-text">{user.email}</div>
              <div className="text-xs text-secundary-text">DNI: {user.dni}</div>
            </li>
          ))}
        </ul>
      )}
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {selectedUsers.map((userId) => {
          const user = users.find((u) => u._id === userId);
          return user ? (
            <div
              key={user._id}
              className="bg-primary-bg border p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-primary-text">
                  {user.name} {user.surname}
                </div>
                <div className="text-sm text-secundary-text">{user.email}</div>
              </div>
              <button
                onClick={() => handleRemoveUser(user._id)}
                className="text-red-600 font-bold text-lg hover:text-red-800"
              >
                ✖
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
  
}