"use client"

import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Mail, UserPlus } from "lucide-react"

export default function AddUserModal({ availableUsers = [], onAddUser = () => { } }) {
    const [open, setOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userRole, setUserRole] = useState("")

    const handleAdd = () => {
        let userToAdd = null

        if (selectedUser) {
            userToAdd = availableUsers.find((user) => user._id === selectedUser) || null
        } else if (userEmail && userRole) {
            const [name, surname] = userEmail.split("@")[0].split(".")
            userToAdd = {
                _id: `user-${Date.now()}`,
                name: name?.charAt(0).toUpperCase() + name?.slice(1) || "",
                surname: surname?.charAt(0).toUpperCase() + surname?.slice(1) || "",
                email: userEmail,
                role: userRole,
            }
        }

        if (userToAdd) {
            onAddUser(userToAdd)
            setSelectedUser("")
            setUserEmail("")
            setUserRole("")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 bg-pink-200 hover:bg-pink-700">
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Añadir
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-900">
                <DialogHeader>
                    <DialogTitle>Añadir participante</DialogTitle>
                    <DialogDescription>
                        Añade un nuevo participante al proyecto. Puedes seleccionar un usuario existente o crear uno nuevo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="existingUser">Usuario existente</Label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar usuario" />
                            </SelectTrigger>
                            <SelectContent className='z-50 bg-white'>
                                {availableUsers.map((user) => (
                                    //   <SelectItem key={user._id} value={user._id} className='hover:bg-pink-300'>
                                    //     {user.name} {user.surname} - {user.role}
                                    //   </SelectItem>
                                    <SelectItem
                                        value="prueba"
                                        className="data-[highlighted]:bg-pink-300 data-[highlighted]:text-white"
                                    >
                                        Prueba
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">
                                O crear nuevo usuario
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <Input
                                id="email"
                                placeholder="usuario@ejemplo.com"
                                type="email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Input
                            id="role"
                            placeholder="Desarrollador, Diseñador, etc."
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleAdd}>Añadir participante</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}