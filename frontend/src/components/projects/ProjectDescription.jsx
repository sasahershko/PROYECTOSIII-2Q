'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FileText } from "lucide-react";
import { NotesIcon } from '@components/svgs';
import AddNotesModal from './AddNotesModal';
import TeamAndDetailsCard from "@/components/projects/TeamAndDetailsCard"
import KeyDatesCard from '@/components/projects/KeyDatesCard';
import NotesSection from '@/components/projects/NotesSection';

const getStatusColor = (status) => {
    const statusMap = {
        Completado: "bg-green-100",
        "En progreso": "bg-blue-100",
        Pendiente: "bg-yellow-100",
        Retrasado: "bg-red-100",
        "No iniciado": "bg-gray-100",
    }

    return statusMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
}

export default function ProjectDescription({ project }) {
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const closeNoteModal = () => setIsNoteModalOpen(false);


    const handleNoteModal = (e) => {
        e.stopPropagation();
        setIsNoteModalOpen(!isNoteModalOpen);
    };

    return (
        <div className="max-h-screen grid grid-cols-3 grid-rows-2 mb-10">

            {/* COLUMNA IZQUIERDA */}
            <div className="col-span-2 row-span-2">
                <div className="flex mt-10 gap-2 ">
                    <h1 className="text-4xl font-bold ml-6">{project.name}</h1>
                    <div className="border-[1px] mt-1 border-black h-[30px] w-20 rounded-md flex items-center justify-center gap-1">
                        <Image src={'/icons/organization.svg'} alt='organization' width={15} height={15}></Image>
                        <p className='text-base sm:text-sm md:text-xs'>{project.company}</p>
                    </div>
                </div>

                <div className='border border-black rounded-full h-[30px] w-32 flex items-center justify-center shadow-md mt-2 ml-6 gap-1'>
                    <div className={`w-4 h-4 rounded-full ${project.pStatus ? getStatusColor(project.pStatus[0]) : 'bg-gray-500'} `}></div>
                    <div className={`text-[15px]`}>
                        {project.pStatus[0].status}
                    </div>
                </div>

                {/* IMAGEN */}
                <div className="ml-7 relative bg-card/25  w-full h-[350px] rounded-lg overflow-hidden shadow-lg  mt-6 mb-6">
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

                <div className='mt-1 ml-6'>
                    <h1 className='text-xl font-semibold'>Descripción del proyecto</h1>
                    <p className='ml-4 mt-2'>{project.description}</p>
                </div>

                {/* NOTAS */}
                <div className="mt-8 ml-6 w-full mb-2">
                    <NotesSection notes={project.pendingNotes} projectId={project._id} projectUsers={project.users}/>
                </div>
                {/* </div> */}

            </div>

            {/* COLUMNA DERECHA ARRIBA */}
            <div className="col-span-1 ">
                {/* {(userRole === "admin" || (userRole === "user" && (isParticipant || isResponsible))) && ( */}
                <div className="space-y-6">
                    <KeyDatesCard project={project} />
                </div>
                <div className="ml-10 mt-10">
                    <TeamAndDetailsCard project={project} />
                </div>
                {/* )} */}
            </div>

            {/* COLUMNA DERECHA ABAJO */}
            <div className="col-span-1 ">

            </div>

        </div>
    )
}