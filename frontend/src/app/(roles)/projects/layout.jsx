// app/layout.js
import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <div>
      <div className="w-auto h-auto bg-primary-bg">{children}</div>
    </div>
  );
}
