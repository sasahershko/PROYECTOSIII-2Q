"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import GradeChip from "@components/ui/chip";
import SpinLoader from "@components/SpinLoader";
import { getProjectById } from "@/lib/projects";
import { getUsers } from "@/lib/users";
import ProjectInUser from "./ProjectInUser";

export default function UserProfileModal({ user, isOpen, onClose }) {
  // If modal closed or no user, don't render
  if (!isOpen || !user) return null;

  const [userDetails, setUserDetails] = useState(user);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && !user.dni) {
        setUserLoading(true);
        try {
          const usersList = await getUsers();
          const updatedUser = usersList.find((u) => u._id === user._id);
          if (updatedUser) setUserDetails(updatedUser);
        } catch (err) {
          console.error(err);
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserDetails(user);
      }
    };
    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userDetails?.projects?.length) {
        setProjects([]);
        return;
      }
      setProjectsLoading(true);
      try {
        const fetched = await Promise.all(
          userDetails.projects.map((id) => getProjectById(id).catch(() => null))
        );
        setProjects(fetched.filter((p) => p));
      } catch (err) {
        console.error(err);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    if (isOpen) fetchProjects();
    else setProjects([]);
  }, [isOpen, userDetails]);

  // Close on backdrop click
  const handleBackdropClick = (e) => e.target === e.currentTarget && onClose();

  const getInitials = (n, s) => ((n?.[0] || "") + (s?.[0] || "")).toUpperCase();

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card p-6 rounded-xl shadow-2xl w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {userLoading ? (
            <div className="flex items-center justify-center py-10">
              <SpinLoader />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  {userDetails.profileImage ? (
                    <img
                      src={userDetails.profileImage}
                      alt="avatar"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-3xl">
                      {getInitials(userDetails.name, userDetails.surname)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-semibold text-primary-text mb-2">
                      {userDetails.name} {userDetails.surname}{" "}
                      <span className="text-base text-secundary-text font-semibold">
                        {userDetails.rol}
                      </span>
                    </h2>
                    <p className="text-md text-primary-text font-medium">
                      {userDetails.email}
                    </p>
                    <p className="text-md text-secundary-text font-medium">
                      {userDetails.dni}
                    </p>
                  </div>
                </div>

                <GradeChip grado={userDetails.grade || "N/A"} />
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-primary-text mb-2">
                  Proyectos del usuario:
                </h3>
                {projectsLoading ? (
                  <div className="flex items-center gap-2">
                    <SpinLoader size="24px" />
                    <p className="text-sm text-gray-500 font-medium">
                      Cargando proyectos...
                    </p>
                  </div>
                ) : projects.length ? (
                  <div className="flex flex-col gap-4 max-h-40 overflow-y-auto pr-4">
                    {projects.map((p) => (
                      <ProjectInUser key={p._id} project={p} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-medium">
                    No hay proyectos asignados.
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
