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
    <div className="mb-6 relative">
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar usuario por nombre, email o DNI"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="p-3 hover:bg-blue-50 cursor-pointer transition-all"
              onClick={() => handleAddUser(user)}
            >
              <div className="text-sm font-medium text-gray-800">
                {user.name} {user.surname}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <div className="text-xs text-gray-400">DNI: {user.dni}</div>
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
              className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-gray-800">
                  {user.name} {user.surname}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
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