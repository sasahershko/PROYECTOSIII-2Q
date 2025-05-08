"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/users";
import DeleteUserModal from "@/components/lists/DeleteUserModal";
import UserProfileModal from "@/components/lists/UserProfileModal";
import EditUserModal from "@/components/lists/EditUserModal";
import { LuTrash, LuPencil } from "react-icons/lu";
import GradeChip from "@/components/ui/chip";
import Image from "next/image";

export default function UserCard({ user, reloadUsers }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const cancelDelete = () => setIsDeleteModalOpen(false);
  const openProfile = () => setIsProfileModalOpen(true);
  const closeProfile = () => setIsProfileModalOpen(false);
  const openEdit = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };
  const closeEdit = () => setIsEditModalOpen(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    deleteUser(user._id);
    reloadUsers();
    setIsDeleteModalOpen(false);
  };

  const getInitials = () => {
    const n = user.name?.charAt(0) || "";
    const s = user.surname?.charAt(0) || "";
    return `${n}${s}`.toUpperCase();
  };

  return (
    <>
      <div
        onClick={openProfile}
        className="grid gap-4 items-center px-2 py-2 border-b border-primary-bg hover:bg-accent/10 transition-colors cursor-pointer"
        style={{ gridTemplateColumns: "auto 2fr 2fr 3fr 2fr 0.8fr 0.8fr 1fr" }}
      >
        {/* Avatar */}
        <div className="flex justify-center items-center">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="text-sm text-primary-text">{user.surname}</div>
        <div className="text-sm text-primary-text">{user.name}</div>
        <div className="text-sm text-primary-text">{user.email}</div>
        <div className="text-sm text-primary-text">{user.dni}</div>
        <div className="text-sm text-primary-text">
          <GradeChip grado={user.grade} />
        </div>
        <div className="text-sm text-primary-text">{user.rol}</div>

        {/* Acciones: editar + eliminar */}
        <div className="flex items-center gap-2">
          <button
            onClick={openEdit}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
          >
            <LuPencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded"
          >
            <LuTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modales */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <UserProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={closeProfile}
      />

      <EditUserModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={closeEdit}
        onUpdated={reloadUsers}
      />
    </>
  );
}
