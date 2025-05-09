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
import { getProfileById } from "@/lib/profile";
import SpinLoader from "@/components/SpinLoader";

export default function TeamAndDetailsCard({ project }) {
  const [userRole, setUserRole] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isResponsible, setIsResponsible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // detalles completos + loading
  const [participantsDetails, setParticipantsDetails] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [responsiblesDetails, setResponsiblesDetails] = useState([]);
  const [responsiblesLoading, setResponsiblesLoading] = useState(true);

  const getInitials = (n, s) => ((n?.[0] || "") + (s?.[0] || "")).toUpperCase();

  // verifica rol y permisos
  useEffect(() => {
    (async () => {
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
    })();
  }, [project]);

  // carga detalles de participantes
  useEffect(() => {
    (async () => {
      setParticipantsLoading(true);
      if (project.users?.length) {
        const details = await Promise.all(
          project.users.map((u) => getProfileById(u._id).catch(() => null))
        );
        setParticipantsDetails(details.filter(Boolean));
      } else {
        setParticipantsDetails([]);
      }
      setParticipantsLoading(false);
    })();
  }, [project.users]);

  // carga detalles de responsables
  useEffect(() => {
    (async () => {
      setResponsiblesLoading(true);
      if (project.responsibles?.length) {
        const details = await Promise.all(
          project.responsibles.map((r) =>
            getProfileById(r._id).catch(() => null)
          )
        );
        setResponsiblesDetails(details.filter(Boolean));
      } else {
        setResponsiblesDetails([]);
      }
      setResponsiblesLoading(false);
    })();
  }, [project.responsibles]);

  if (
    loading ||
    !(
      userRole === "admin" ||
      (userRole === "user" && (isParticipant || isResponsible))
    )
  ) {
    return null;
  }

  return (
    <Card className="shadow-sm max-w-[520px] p-0.5 rounded-t-lg">
      <CardContent className="p-0 bg-primary-bg">
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-t-lg border-b">
            <TabsTrigger value="team">
              <Users className="w-4 h-4" /> Equipo
            </TabsTrigger>
            <TabsTrigger value="details">
              <UserCog className="w-4 h-4" /> Detalles
            </TabsTrigger>
          </TabsList>

          {/* PESTAÑA EQUIPO */}
          <TabsContent value="team" className="p-4 space-y-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" /> Participantes
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1 bg-accent text-white rounded"
              >
                + Añadir
              </button>
              <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
              />
            </div>

            {participantsLoading ? (
              <div className="flex justify-center py-8">
                <SpinLoader size="32px" />
              </div>
            ) : participantsDetails.length > 0 ? (
              <ScrollArea className="h-48 space-y-3 pr-4 pb-4">
                {participantsDetails.map((u) => (
                  <TooltipProvider key={u.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-card cursor-pointer"
                          onClick={() => setSelectedUser(u)}
                        >
                          <Avatar>
                            {u.profileImage ? (
                              <AvatarImage src={u.profileImage} />
                            ) : (
                              <AvatarFallback>
                                {getInitials(u.name, u.surname)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {u.name} {u.surname}
                            </p>
                            {u.rol && (
                              <p className="text-xs text-secundary-text">
                                {u.rol}
                              </p>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{u.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </ScrollArea>
            ) : (
              <p className="text-center text-secundary-text">
                No hay participantes.
              </p>
            )}
          </TabsContent>

          {/* PESTAÑA DETALLES */}
          <TabsContent value="details" className="p-4 space-y-6">
            {/* Fechas */}
            {project.reviewDates?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
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

            {/* Responsables */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <UserCog className="w-4 h-4" /> Responsables
              </h3>
              {responsiblesLoading ? (
                <div className="flex justify-center py-8">
                  <SpinLoader size="32px" />
                </div>
              ) : responsiblesDetails.length > 0 ? (
                <div className="space-y-3">
                  {responsiblesDetails.map((r) => (
                    <TooltipProvider key={r.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-card cursor-pointer"
                            onClick={() => setSelectedUser(r)}
                          >
                            <Avatar>
                              {r.profileImage ? (
                                <AvatarImage src={r.profileImage} />
                              ) : (
                                <AvatarFallback>
                                  {getInitials(r.name, r.surname)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{r.name}</p>
                              {r.rol && (
                                <p className="text-xs text-secundary-text">
                                  {r.rol}
                                </p>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{r.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ) : (
                <p className="text-center text-secundary-text">
                  No hay responsables.
                </p>
              )}
            </div>

            {/* Cliente externo */}
            {project.contactPerson && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
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
                    <p className="font-medium">{project.contactPerson.name}</p>
                    <p className="text-xs text-gray-500">
                      {project.contactPerson.email}
                      <br />
                      {project.contactPerson.phone}
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

      {/* Modal de perfil */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isOpen={true}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </Card>
  );
}
