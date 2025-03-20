import { FaUsers, FaLightbulb, FaNetworkWired, FaGraduationCap } from "react-icons/fa";

const beneficios = [
  {
    icon: <FaGraduationCap size={30} className="text-blue-500" />,
    title: "Gestión Centralizada",
    description: "Todos tus proyectos en un solo lugar",
  },
  {
    icon: <FaUsers size={30} className="text-blue-500" />,
    title: "Colaboración",
    description: "Trabaja con estudiantes y profesionales",
  },
  {
    icon: <FaLightbulb size={30} className="text-blue-500" />,
    title: "Innovación",
    description: "Acceso a herramientas de última generación",
  },
  {
    icon: <FaNetworkWired size={30} className="text-blue-500" />,
    title: "Networking",
    description: "Conecta con empresas líderes",
  }
];

const PorqueElegir = () => {
  return (
    <div className="w-full max-w-7xl bg-gray-100 mx-auto py-14 px-10 mb-6">
      <div className="container max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Por qué elegir el Project Center de U-tad?
        </h2>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {beneficios.map((beneficio, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {beneficio.icon}
              <h3 className="text-lg font-semibold mt-4">{beneficio.title}</h3>
              <p className="text-gray-600 mt-2">{beneficio.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PorqueElegir;
