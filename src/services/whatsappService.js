// services/whatsappService.js
import supabase from "../lib/supabaseClient";
import parseMxPhone from "../utils/parserMxPhone";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp`;

export async function sendWhatsAppInvite({
  guest,
  eventId,
  isSandbox,
}) {
  if (!guest.phone) {
    throw new Error("NO_PHONE");
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("NO_SESSION");
  }
  console.log(guest)
  const inviteUrl = isSandbox
    ? `http://localhost:5173/${eventId}/${guest.id}/${guest.access_token}`
    : `https://app.witinvitaciones.com/${eventId}/${guest.id}/${guest.access_token}`;

  const phoneFormatted = parseMxPhone(guest.phone, isSandbox);

  const payload = {
        phone: phoneFormatted,
        templateName: "ali_wit",
        params: [guest.name, inviteUrl],
    };

  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "SEND_ERROR");
  }

  return data;
}