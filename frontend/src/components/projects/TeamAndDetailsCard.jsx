"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Users, UserCog, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserData } from "@/lib/authClient";
import { formatDate } from "@/utils/projectUtils";
import AddUserModal from "@/components/projects/AddUserModal";
import UserProfileModal from "../lists/UserProfileModal";

export default function TeamAndDetailsCard({ project }) {
  const [userRole, setUserRole] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isResponsible, setIsResponsible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Función para abrir el modal del perfil del usuario clickeado
  const openProfile = (user) => setSelectedUser(user);
  const closeProfile = () => setSelectedUser(null);

  const handleNoteModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const { role, id } = await getUserData();
        setUserRole(role);
        setIsParticipant(project.users?.some((u) => u._id === id));
        setIsResponsible(project.responsibles?.some((r) => r._id === id));
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [project]);

  if (
    loading ||
    !(
      userRole === "admin" ||
      (userRole === "user" && (isParticipant || isResponsible))
    )
  )
    return null;

  return (
    <Card className="shadow-sm max-w-[520px] p-0.5 rounded-t-lg">
      <CardContent className="p-0 bg-primary-bg">
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-t-lg rounded-b-none">
            <TabsTrigger value="team">
              <Users className="w-4 h-4" /> Equipo
            </TabsTrigger>
            <TabsTrigger value="details">
              <UserCog className="w-4 h-4" /> Detalles
            </TabsTrigger>
          </TabsList>

          {/* TEAM */}
          <TabsContent value="team" className="p-4 pt-6 space-y-6">
            {project.users?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" /> Participantes
                  </h3>
                  <div className="mr-4 shadow-lg border w-[90px] h-[30px] rounded-lg flex justify-center items-center">
                    <button onClick={handleNoteModal}>+ Añadir</button>
                  </div>

                  <AddUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  />
                </div>
                <ScrollArea className="h-48 pr-4 space-y-3 pb-4">
                  {project.users.map((user, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-card hover:cursor-pointer"
                            onClick={() => openProfile(user)}
                          >
                            <Avatar>
                              <AvatarImage src="/tempPhotos/default-avatar.jpg" />
                              <AvatarFallback>
                                {user?.name?.[0] ?? ""}
                                {user?.surname?.[0] ?? ""}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.name} {user.surname}
                              </p>
                              {user.role && (
                                <p className="text-xs text-primary-bg">
                                  {user.role}
                                </p>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          {/* DETAILS */}
          <TabsContent value="details" className="p-4 pt-6 space-y-6">
            {project.reviewDates?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Fechas de revisión
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.reviewDates.map((date, i) => (
                    <Badge key={i} variant="outline" className="py-1.5">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(date).toLocaleDateString()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.responsibles?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <UserCog className="w-4 h-4" /> Responsables
                </h3>
                <div className="space-y-3">
                  {project.responsibles.map((person, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-600">
                            <Avatar>
                              <AvatarImage src="/default-avatar.png" />
                              <AvatarFallback>{person.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{person.name}</p>
                              {person.role && (
                                <p className="text-xs text-gray-500">
                                  {person.role}
                                </p>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{person.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}

            {project.contactPerson && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Cliente Externo
                </h3>
                <div className="flex items-center gap-3 p-2 rounded-md bg-primary-bg">
                  <Avatar>
                    <AvatarImage src="/default-avatar.png" />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.contactPerson}</p>
                    <p className="text-xs text-gray-500">
                      Sin información de contacto
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 pt-2 pb-4 px-4 bg-primary-bg">
        Última actualización: {formatDate(new Date().toISOString())}
      </CardFooter>

      {/* Modal único para el perfil del usuario seleccionado */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isOpen={true}
          onClose={closeProfile}
        />
      )}
    </Card>
  );
}
