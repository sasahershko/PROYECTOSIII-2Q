// app/layout.js
import "@/app/globals.css";
import Footer from "@components/Footer";
import UserNavBar from "@/components/user/ProjectsNavbBar";

export default function RootLayout({ children }) {
    return (
        <div>
            <UserNavBar />
            <div className="w-auto h-auto bg-primary-bg">{children}</div>
        </div>
    );
}
