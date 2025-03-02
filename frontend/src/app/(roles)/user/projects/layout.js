// app/layout.js
import "@/app/globals.css";
import Footer from "@components/Footer";
import ProjectsNavbBar from "@components/projects/ProjectsNavBar";

export default function RootLayout({ children }) {
    return (
        <div>
            <ProjectsNavbBar />
            <div className="w-auto h-auto bg-primary-bg">{children}</div>
        </div>
    );
}
