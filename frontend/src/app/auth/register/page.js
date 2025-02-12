import Register from "@/components/Register";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Registro</h1>
        <Register />
      </div>
    </div>
  );
}
