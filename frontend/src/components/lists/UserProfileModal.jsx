import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import GradeChip from "@components/ui/chip";
import SpinLoader from "@components/SpinLoader"; // <-- Import your loader
import { getProjectById } from "@/lib/projects";
import { getUsers } from "@/lib/users";
import ProjectInUser from "./ProjectInUser";

export default function UserProfileModal({ user, isOpen, onClose }) {
  // Local state for the user's full details
  const [userDetails, setUserDetails] = useState(user);

  // Projects + loading states
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Loading state specifically for user details
  const [userLoading, setUserLoading] = useState(false);

  /**
   * 1) Fetch additional user details (if missing), and update local state
   */
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && !user.dni) {
        setUserLoading(true);
        try {
          const usersList = await getUsers();
          const updatedUser = usersList.find((u) => u._id === user._id);
          if (updatedUser) {
            setUserDetails(updatedUser);
          } else {
            console.error("Usuario no encontrado:", user._id);
          }
        } catch (error) {
          console.error("Error al obtener los usuarios:", error);
        } finally {
          setUserLoading(false);
        }
      } else {
        // If the user is null or already has a dni, no need to fetch again
        setUserDetails(user);
      }
    };

    fetchUserDetails();
  }, [user]);

  /**
   * 2) Fetch projects from userDetails.projects when the modal is open
   */
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userDetails?.projects || userDetails.projects.length === 0) {
        setProjects([]);
        return;
      }

      setProjectsLoading(true);
      try {
        const fetchedProjects = await Promise.all(
          userDetails.projects.map(async (projectId) => {
            try {
              return await getProjectById(projectId);
            } catch (error) {
              console.warn(
                `Error al obtener el proyecto con ID ${projectId}:`,
                error.message
              );
              return null; // Ignore this project if it fails
            }
          })
        );
        const validProjects = fetchedProjects.filter((p) => p !== null);
        setProjects(validProjects);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (isOpen && userDetails) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [isOpen, userDetails]);

  // Avoid rendering on SSR if `window` is not defined
  if (typeof window === "undefined") return null;

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-card p-6 rounded-xl shadow-2xl w-full max-w-4xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 
              3) If we're still loading the user details, show the SpinLoader.
                 Otherwise, render the normal content.
            */}
            {userLoading ? (
              <div className="flex items-center justify-center py-10">
                <SpinLoader />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Placeholder for a user photo/Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gray-300 shrink-0" />
                    <div>
                      <h2 className="text-3xl font-semibold text-primary-text mb-3">
                        {userDetails?.name} {userDetails?.surname}{" "}
                        <span className="font-semibold text-base text-secundary-text">
                          {userDetails?.rol}
                        </span>
                      </h2>
                      <p className="text-md text-primary-text font-medium">
                        {userDetails?.email}
                      </p>
                      <p className="text-md text-secundary-text font-medium">
                        {userDetails?.dni}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 justify-center">
                    <GradeChip grado={userDetails?.grade || "N/A"} />
                  </div>
                </div>

                {/* Projects */}
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
                  ) : projects.length > 0 ? (
                    <div className="flex flex-col gap-4 h-32 overflow-y-scroll pr-4">
                      {projects.map((proj) => (
                        <ProjectInUser key={proj._id} project={proj} />
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
      )}
    </AnimatePresence>,
    document.body
  );
}
