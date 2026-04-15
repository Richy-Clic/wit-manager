const parseMxPhone = (phone, isSandbox) => {
  if (!phone) return null;

  // 1. limpiar todo lo que no sea número
  let cleaned = phone.replace(/\D/g, "");

  // 2. quitar prefijos antiguos de México
  cleaned = cleaned.replace(/^044|^045/, "");

  // 3. normalizar longitud
  if (cleaned.length === 10) {
    cleaned = "52" + cleaned;
  }

  // 4. validar estructura base (México)
  const isValidMx =
    cleaned.length === 12 &&
    cleaned.startsWith("52") &&
    /^[0-9]+$/.test(cleaned);

  if (!isValidMx) {
    return "❌ Número inválido (estructura): " + phone;
  }

  // 6. sandbox vs producción
  if (isSandbox) {
    // convertir 52XXXXXXXXXX → 521XXXXXXXXXX
    return "521" + cleaned.slice(2);
  }

  // producción
  return cleaned;
};

export default parseMxPhone;