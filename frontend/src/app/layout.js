// import "@/app/globals.css";
// import { ThemeProvider } from "next-themes";
// import { useEffect, useState } from "react";

// export default function RootLayout({ children }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <html lang="es">
//       <ThemeProvider attribute={"class"} enableColorScheme={false}>
//         <body>{children}</body>
//       </ThemeProvider>
//     </html >
//   );
// }

import "@/app/globals.css";
import { ThemeProvider } from "next-themes";


export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning={true} lang="es">
      <body>{children}</body>
    </html>
  );
}
