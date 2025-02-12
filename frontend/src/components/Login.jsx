"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error en la autenticación");

      router.push("/dashboard"); // Redirigir tras login exitoso
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Email</label>
        <input
          {...register("email", { required: "Email es obligatorio" })}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block">Contraseña</label>
        <input
          type="password"
          {...register("password", { required: "Contraseña es obligatoria" })}
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        Iniciar sesión
      </button>
    </form>
  );
}
