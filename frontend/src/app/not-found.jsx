// pages/404.js
import Link from "next/link";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { ThemeProvider } from "next-themes";

export default function Custom404() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-primary-bg">
        <Card>
          <div className="flex flex-col items-center space-y-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[3.75rem] h-[3.75rem] stroke-primary-text"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M12 15H12.01M12 12V9M4.98207 19H19.0179C20.5615 19 21.5233 17.3256 20.7455 15.9923L13.7276 3.96153C12.9558 2.63852 11.0442 2.63852 10.2724 3.96153L3.25452 15.9923C2.47675 17.3256 3.43849 19 4.98207 19Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            <h1 className="text-6xl font-bold m-0 leading-none">404</h1>
          </div>
          <p className="text-xl text-secundary-text mt-8 mb-8">
            ¡Ups! La página que buscas no existe.
          </p>
          <Link
            href="/"
            className="mt-8 px-4 py-2 bg-accent text-white rounded-md no-underline hover:bg-accent/80 transition duration-300"
          >
            Volver al inicio
          </Link>
        </Card>
      </div>
    </ThemeProvider>
  );
}
