import {
  FaUsers,
  FaLightbulb,
  FaNetworkWired,
  FaGraduationCap,
} from "react-icons/fa";

const beneficios = [
  {
    icon: <FaGraduationCap size={38} className="text-accent" />,
    title: "Gestión Centralizada",
    description: "Todos tus proyectos en un solo lugar",
  },
  {
    icon: <FaUsers size={38} className="text-accent" />,
    title: "Colaboración",
    description: "Trabaja con estudiantes y profesionales",
  },
  {
    icon: <FaLightbulb size={38} className="text-accent" />,
    title: "Innovación",
    description: "Acceso a herramientas de última generación",
  },
  {
    icon: <FaNetworkWired size={38} className="text-accent" />,
    title: "Networking",
    description: "Conecta con empresas líderes",
  },
];

const PorqueElegir = () => {
  return (
    <div className="w-full max-w-7xl bg-card mx-auto py-14 px-10 mb-6 rounded-xl shadow-md">
      <div className="container max-w-7xl mx-auto px-6">
        <h2 className="text-[42px] font-bold text-center mb-14">
          <span>¿Por qué elegir el </span>
          <span className="bg-gradient-to-b from-white to-50% to-accent bg-clip-text text-transparent">
            Project Center
          </span>
          <span> de U-tad?</span>
        </h2>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {beneficios.map((beneficio, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {beneficio.icon}
              <h3 className="text-xl font-semibold mt-4">{beneficio.title}</h3>
              <p className="text-secundary-text mt-2">
                {beneficio.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PorqueElegir;
