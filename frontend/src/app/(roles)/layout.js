//TEMPORAL
import "@/app/globals.css";
import Header from "@components/Header";
import Footer from "@components/Footer";

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className="font-sans bg-[#161B22]">
                <Header />
                <div className="w-auto h-auto pt-20">{children}</div>
                {/* <Footer /> */}
            </body>
        </html>
    );
}