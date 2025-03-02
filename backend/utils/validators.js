// Función para calcular la letra correcta del DNI
export const calcularLetraDNI = (dni) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  return letras[dni % 23];
};

// Función de validación del DNI
export const validarDNI = (dni) => {
  const regex = /^\d{8}[A-Z]$/;
  if (!regex.test(dni)) return false;

  const numeros = parseInt(dni.slice(0, 8), 10);
  const letra = dni.charAt(8);

  return calcularLetraDNI(numeros) === letra;
};

// Función de validación de email
export const validarEmail = (email) => {
  return /@u-tad\.com$|@live\.u-tad\.com$/.test(email);
};
