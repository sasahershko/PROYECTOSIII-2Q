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

// Función de validación del correo institucional
export const validarCorreo = (correo) => {
  const correoRegex = /@u-tad\.com$|@live\.u-tad\.com$/;
  return correoRegex.test(correo);
};

// Función de validación de contraseña
export const validarPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Función para validar que las contraseñas coincidan
export const validarConfirmacionPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Función para validar el grado permitido
export const validarGrado = (grado) => {
  const gradosPermitidos = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"];
  return gradosPermitidos.includes(grado);
};
