import Image from "next/image";

export default function ProjectDescription({ project }) {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold">{project.name}</h1>

        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-800">
          {project.pStatus[0]?.status || "No iniciado"}
        </span>

        {/* Imagen */}
        <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-md">
          <span className="text-gray-600">Imagen</span>
        </div>

        {/* Descripción */}
        <h2 className="text-lg font-semibold">Descripción del proyecto</h2>
        <p className="text-gray-700">{project.description}</p>
      </div>

      {/* Sidebar de info */}
      <div className="space-y-6 p-4 bg-gray-100 rounded-md shadow-md">
        {/* Sección Acerca */}
        <div>
          <h3 className="text-xl font-semibold">Acerca</h3>
          <p className="text-gray-600 flex items-center">
            {new Date(project.startDate).toLocaleDateString()} -{" "}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 flex items-center">
            {project.company} - Proyect Center
          </p>

          {/* Botón de acción */}
          <button className="w-full mt-3 px-4 py-2 bg-black text-white rounded-md">
            Reservar mi plaza
          </button>
          <p className="text-gray-500 text-sm mt-2">La inscripción se cierra en 10 días</p>

          {/* Fechas de revisión */}
          <div className="mt-4 flex space-x-2">
            {project.reviewDates.map((date, index) => (
              <span key={index} className="px-3 py-1 text-sm bg-gray-300 rounded-full">
                {new Date(date).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>

        {/* Persona de Contacto */}
        <div>
          <h3 className="text-lg font-semibold">Persona de Contacto:</h3>
          {project.responsibles.map((person, index) => (
            <div key={index} className="flex items-center space-x-3 mt-3">
              <Image src="/default-avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-gray-600 text-sm">{person.email}</p>
                <p className="text-gray-600 text-sm">{person.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cliente Externo (si aplica) */}
        {project.contactPerson && (
          <div>
            <h3 className="text-lg font-semibold">Cliente Externo (si aplica):</h3>
            <div className="flex items-center space-x-3 mt-3">
              <Image src="/default-avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
              <div>
                <p className="font-medium">{project.contactPerson}</p>
                <p className="text-gray-600 text-sm">Sin información de contacto</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
