// app/layout.js
import "@/app/globals.css";
import AdminNavBar from "@/components/admin/ProjectsNavBar";

export default function RootLayout({ children }) {
  return (
    <div>
      <AdminNavBar />
      <div className="w-auto h-auto bg-primary-bg">{children}</div>
    </div>
  );
}
