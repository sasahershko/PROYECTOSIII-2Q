import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning={true} lang="es">
      <body>{children}</body>
    </html>
  );
}

