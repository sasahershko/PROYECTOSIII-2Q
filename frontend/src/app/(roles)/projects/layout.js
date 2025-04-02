// app/layout.js
import "@/app/globals.css";
import ProjectsNavBar from "@/components/projects/ProjectsNavBar";

export default function RootLayout({ children }) {
  return (
    <div>
      <div className="w-auto h-auto bg-primary-bg">{children}</div>
    </div>
  );
}
