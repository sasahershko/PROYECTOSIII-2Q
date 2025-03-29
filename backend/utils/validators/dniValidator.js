export const calcularLetraDNI = (dni) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  return letras[dni % 23];
};

export const validarDNI = (dni) => {
  const regex = /^\d{8}[A-Z]$/;
  if (!regex.test(dni)) return false;

  const numeros = parseInt(dni.slice(0, 8), 10);
  const letra = dni.charAt(8);

  return calcularLetraDNI(numeros) === letra;
};
