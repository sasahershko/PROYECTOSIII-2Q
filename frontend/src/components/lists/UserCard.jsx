import { useState } from "react";
import { deleteUser } from "@/lib/users";

export default function UserCard({ user, reloadUsers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abre el modal
  const handleDelete = () => {
    setIsModalOpen(true);
  };

  // Lógica de confirmación
  const confirmDelete = () => {
    deleteUser(user._id);
    reloadUsers();
    setIsModalOpen(false);
  };

  // Cierra el modal sin eliminar
  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Fila de usuario con border-b para separar */}
      <div
        className="grid gap-4 items-center py-2 border-b"
        style={{
          gridTemplateColumns: "2fr 2fr 3fr 2fr 0.8fr 0.8fr 1fr",
        }}
      >
        {/* Apellido */}
        <div className="text-sm font-semibold text-primary-text">
          {user.surname}
        </div>
        {/* Nombre */}
        <div className="text-sm text-primary-text">{user.name}</div>
        {/* Email */}
        <div className="text-sm text-primary-text">{user.email}</div>
        {/* DNI */}
        <div className="text-sm text-primary-text">{user.dni}</div>
        {/* Grado */}
        <div className="text-sm text-primary-text">{user.grade}</div>
        {/* Rol */}
        <div className="text-sm text-primary-text">{user.rol}</div>
        {/* Botón de borrar */}
        <div>
          <button onClick={handleDelete} className="p-2 bg-red-300 rounded">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M20.5001 6H3.5"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9.5 11L10 16"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M14.5 11L14 16"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
              <path
                d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar este usuario?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={cancelDelete}
                className="mr-2 px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
