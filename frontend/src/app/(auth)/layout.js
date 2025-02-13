import "@/app/globals.css";

export default function AuthLayout({ children }) {
  return (
    <html>
      <body className="font-sans text-copy-primary">{children}</body>
    </html>
  );
}
