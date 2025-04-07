import { useState } from "react";
import { deleteUser } from "@/lib/users";
import DeleteUserModal from "@/components/lists/DeleteUserModal";
import UserProfileModal from "@/components/lists/UserProfileModal";
import GradeChip from "@components/ui/chip";

export default function UserCard({ user, reloadUsers }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const cancelDelete = () => setIsDeleteModalOpen(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const openProfile = () => setIsProfileModalOpen(true);
  const closeProfile = () => setIsProfileModalOpen(false);

  const handleDelete = (e) => {
    e.stopPropagation(); // Evita que también abra el modal de perfil
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteUser(user._id);
    reloadUsers();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        onClick={openProfile}
        className="grid gap-4 items-center px-2 py-2 border-b border-primary-bg hover:bg-accent/10 transition-colors cursor-pointer"
        style={{ gridTemplateColumns: "2fr 2fr 3fr 2fr 0.8fr 0.8fr 1fr" }}
      >
        <div className="text-sm text-primary-text">{user.surname}</div>
        <div className="text-sm text-primary-text">{user.name}</div>
        <div className="text-sm text-primary-text">{user.email}</div>
        <div className="text-sm text-primary-text">{user.dni}</div>
        <div className="text-sm text-primary-text">
          <GradeChip grado={user.grade} />
        </div>
        <div className="text-sm text-primary-text">{user.rol}</div>
        <div className="flex items-center">
          <button
            onClick={handleDelete}
            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7L5 7M10 11V17M14 11V17M6 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7"
              />
            </svg>
          </button>
        </div>
      </div>

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
    </>
  );
}
