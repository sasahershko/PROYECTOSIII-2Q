import Link from "next/link";

export default function AdminNavBar() {
    return(
    <nav className="border-b px-6 py-4 bg-secundary text-white flex items-center justify-between">
        <div className="flex space-x-6">
            <Link href="/user/projects" className="font-bold text-lg">
                Proyectos
            </Link>
        </div>
    </nav>
    )
}