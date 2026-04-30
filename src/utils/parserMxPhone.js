const parseMxPhone = (phone) => {
  if (!phone) return null;

  // 1. limpiar todo lo que no sea número
  let cleaned = phone.replace(/\D/g, "");

  // 2. quitar prefijos antiguos (044, 045)
  cleaned = cleaned.replace(/^(044|045)/, "");

  // 3. quitar +52 duplicado o mal formado
  if (cleaned.startsWith("52") && cleaned.length === 12) {
    // convertir 52XXXXXXXXXX → 521XXXXXXXXXX
    cleaned = "521" + cleaned.slice(2);
  }

  // 4. si ya viene bien (521XXXXXXXXXX)
  if (cleaned.length === 13 && cleaned.startsWith("521")) {
    return cleaned;
  }

  // 5. si viene como 10 dígitos (local)
  if (cleaned.length === 10) {
    return "521" + cleaned;
  }

  // 6. inválido
  return null;
};

export default parseMxPhone;