"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Calendar,
  Clock,
  Hourglass,
  User,
  Building,
  FileText,
  CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Users,
  UserCog,
  UserPlus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUserData } from "@/lib/authClient";
import { formatDate, getProjectDates } from "@/utils/projectUtils";

//STATUS COLOR
const getStatusColor = (status) => {
  const statusMap = {
    Completado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "En progreso": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Retrasado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Pausado: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  return statusMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
}

// CALCULAR EL TIMELINE
const calculateTimeline = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()

  const totalDuration = end.getTime() - start.getTime()
  const elapsedDuration = today.getTime() - start.getTime()

  // Calculate percentage (capped between 0-100)
  const percentage = Math.max(0, Math.min(100, Math.round((elapsedDuration / totalDuration) * 100)))

  // Calculate days remaining
  const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return { percentage, daysRemaining }
}

export default function ProjectDescription({ project }) {
  const [userRole, setUserRole] = useState(null)
  const [isParticipant, setIsParticipant] = useState(false)
  const [isResponsible, setIsResponsible] = useState(false)
  const [loading, setLoading] = useState(true)
  const dates = getProjectDates(project)
  const timeline = calculateTimeline(project.startDate, project.endDate)


  useEffect(() => {
    async function fetchUserRole() {
      setLoading(true)
      try {
        const { role, id } = await getUserData()
        setUserRole(role)
        console.log(role)

        setIsParticipant(project.users.some((p) => p._id === id))
        setIsResponsible(project.responsibles.some((r) => r._id === id))
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [project])


  console.log(isResponsible)

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Main content - Left side */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {project.company}
                  </Badge>
                  {project.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge className={cn("text-sm py-1 px-3", getStatusColor(project.pStatus[0]?.status))}>
                {project.pStatus[0]?.status === "En progreso" && <Clock3 className="w-3.5 h-3.5 mr-1" />}
                {project.pStatus[0]?.status === "Completado" && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                {project.pStatus[0]?.status === "Retrasado" && <AlertCircle className="w-3.5 h-3.5 mr-1" />}
                {project.pStatus[0]?.status || "No iniciado"}
              </Badge>
            </div>

            {/* Project Image */}
            <div className="relative w-full h-[350px] rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-inner mt-6 mb-6">
              {project.image ? (
                <Image
                  src={project.image || "/placeholder.svg?height=350&width=700"}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400 mb-2" />
                  <span className="text-gray-500 font-medium">Vista previa no disponible</span>
                </div>
              )}
            </div>

            {/* Project Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progreso del proyecto</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Inicio: {formatDate(project.startDate)}</span>
                <span className="text-xs text-gray-500">
                  {timeline.daysRemaining > 0 ? `${timeline.daysRemaining} días restantes` : "Plazo vencido"}
                </span>
                <span className="text-xs text-gray-500">Fin: {formatDate(project.endDate)}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Descripción del proyecto</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Right side */}
      {(userRole === "admin" || (userRole === "user" && (isParticipant || isResponsible))) && (
        <div className="space-y-6">
          {/* Key Dates Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Fechas Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3">
                {dates.map((date, i) => {
                  if (!date) return null; // Evita renderizar si `date` es undefined/null

                  const label = i === 0 ? "Inicio" : i === 1 ? "Fin" : "Próxima revisión";

                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="bg-primary/10 rounded-full p-2">
                        {date.icon === "calendar" && <Calendar className="w-4 h-4 text-primary" />}
                        {date.icon === "clock" && <Clock className="w-4 h-4 text-primary" />}
                        {date.icon === "hourglass" && <Hourglass className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                        <p className="text-sm font-medium">{formatDate(date.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </CardContent>
          </Card>

          {/* Project Details Tabs */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Tabs defaultValue="team" className="w-full">
                <TabsList className="grid grid-cols-2 w-full rounded-t-lg rounded-b-none">
                  <TabsTrigger value="team" className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Equipo</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-1">
                    <UserCog className="w-4 h-4" />
                    <span>Detalles</span>
                  </TabsTrigger>
                </TabsList>

                {/* Team Tab */}
                <TabsContent value="team" className="p-4 pt-6 space-y-6">
                  {/* Participants */}
                  {project.users?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Participantes
                        </h3>
                        <Button variant="outline" size="sm" className="h-8">
                          <UserPlus className="w-3.5 h-3.5 mr-1" />
                          Añadir
                        </Button>
                      </div>
                      <ScrollArea className="h-48 pr-4">
                        <div className="space-y-3">
                          {project.users.map((user, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <Avatar>
                                      <AvatarImage src="/tempPhotos/default-avatar.jpg" alt={user.name} />
                                      <AvatarFallback>
                                        {user.name.charAt(0)}
                                        {user.surname?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {user.name} {user.surname}
                                      </p>
                                      {user.role && <p className="text-xs text-gray-500">{user.role}</p>}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{user.email}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="p-4 pt-6 space-y-6">
                  {/* Review Dates */}
                  {project.reviewDates?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Fechas de revisión
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.reviewDates.map((date, index) => (
                          <Badge key={index} variant="outline" className="py-1.5">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {new Date(date).toLocaleDateString()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Responsibles */}
                  {project.responsibles?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <UserCog className="w-4 h-4" />
                        Responsables
                      </h3>
                      <div className="space-y-3">
                        {project.responsibles.map((person, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                  <Avatar>
                                    <AvatarImage src="/default-avatar.png" alt={person.name} />
                                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{person.name}</p>
                                    {person.role && <p className="text-xs text-gray-500">{person.role}</p>}
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

                  {/* External Contact */}
                  {project.contactPerson && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Cliente Externo
                      </h3>
                      <div className="flex items-center gap-3 p-2 rounded-md bg-white dark:bg-gray-800">
                        <Avatar>
                          <AvatarImage src="/default-avatar.png" alt={project.contactPerson} />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{project.contactPerson}</p>
                          <p className="text-xs text-gray-500">Sin información de contacto</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 pt-2 pb-4 px-4">
              Última actualización: {formatDate(new Date().toISOString())}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-[350px] w-full rounded-lg mt-6 mb-6" />
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="p-4">
              <Skeleton className="h-10 w-full mb-6" />
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-32 mb-3" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-48" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

