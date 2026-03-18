export const parseMxPhone = (phone, isSandbox) => {
    console.log(phone, isSandbox);
    
  if (!phone) return null;

  // 1. limpiar todo lo que no sea número
  let cleaned = phone.replace(/\D/g, "");

  // 2. quitar prefijos antiguos de México
  cleaned = cleaned.replace(/^044|^045/, "");

  // 3. normalizar longitud
  if (cleaned.length === 10) {
    // número local
    cleaned = "52" + cleaned;
  }

  // 4. validar estructura base (México)
  const isValidMx =
    cleaned.length === 12 &&
    cleaned.startsWith("52") &&
    /^[0-9]+$/.test(cleaned);

  if (!isValidMx) {
    console.warn("❌ Número inválido (estructura):", phone);
    return null;
  }

//   // 5. validar que sea celular (opcional pero recomendado)
//   // en México celulares empiezan con 55, 56, 33, etc.
//   const lada = cleaned.slice(2, 4);

  const validLadas = [
    "33", "55", "56", "81", "222", "999" // puedes expandir esto
  ];

  if (!validLadas.some((l) => cleaned.slice(2).startsWith(l))) {
    console.warn("⚠️ LADA sospechosa:", phone);
    // no lo bloqueamos, solo warning
  }

  // 6. sandbox vs producción
  if (isSandbox) {
    // convertir 52XXXXXXXXXX → 521XXXXXXXXXX
    return "521" + cleaned.slice(2);
  }

  // producción
  return cleaned;
};