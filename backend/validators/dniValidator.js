import { body } from "express-validator";

// Función para calcular la letra del DNI
const calcularLetraDNI = (dni) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const numero = parseInt(dni.slice(0, 8), 10);
  return letras[numero % 23];
};

// Validador para express-validator
export const dniValidator = body("dni").custom((value) => {
  if (!/^\d{8}[A-Z]$/.test(value)) {
    throw new Error("El formato del DNI no es válido");
  }

  const letra = value.slice(8);
  const letraEsperada = calcularLetraDNI(value);

  if (letra !== letraEsperada) {
    throw new Error("La letra del DNI no es correcta");
  }

  return true;
});
