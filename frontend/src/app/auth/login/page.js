import Login from "@/components/Login";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h1>
        <Login />
      </div>
    </div>
  );
}
