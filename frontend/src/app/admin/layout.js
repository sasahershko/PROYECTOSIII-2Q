//TEMPORAL
import "@/app/globals.css";
import Footer from "@components/Footer";
export default function RootLayout({ children }) {

    return (
        <html lang="es">
            <body className="font-sans text-copy-primary">
                {children}
                <Footer />
            </body>
        </html>
    );
}