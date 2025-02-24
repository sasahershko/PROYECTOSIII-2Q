import Link from "next/link";

export default function ProjectsNavBar() {
    return(
    <nav className="border-b px-6 py-4 bg-primary text-white flex items-center justify-between">
        <div className="flex space-x-6">
            <Link href="/admin/projects" className="font-bold text-primary-text text-lg transition duration-300 hover:text-gray-500">
                Proyectos
            </Link>
            <Link href="/user/projects/calendar" className="text-primary-text transition duration-300 hover:text-gray-500">
                Calendario
            </Link>
        </div>
    </nav>
    )
}