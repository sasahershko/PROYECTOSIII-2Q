"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@lib/users";

export default function UserSelector({ selectedUsers, setSelectedUsers, label }) {
  const [users, setUsers] = useState([]);

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

  const handleAddUser = (userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold">{label}</label>
      <select
        className="w-full border rounded p-2 mb-2"
        onChange={(e) => handleAddUser(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Seleccionar usuario</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedUsers.map((userId) => {
          const user = users.find((u) => u._id === userId);
          return user ? (
            <div key={user._id} className="bg-gray-200 px-3 py-1 rounded flex items-center space-x-2">
              <span>{user.name}</span>
              <button
                onClick={() => handleRemoveUser(user._id)}
                className="text-red-600 font-bold"
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
