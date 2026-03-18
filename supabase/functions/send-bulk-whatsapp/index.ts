import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_ID");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guests } = await req.json();

    if (!guests || !Array.isArray(guests)) {
      return new Response(
        JSON.stringify({ error: "guests array required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const results = [];

    // 🔥 LOOP CORRECTO
    for (const guest of guests) {
      try {
        console.log("📤 Enviando a:", guest.phone);

        const res = await fetch(
          `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: guest.phone,
              type: "text",
              text: {
                body: `Hola ${guest.name} 👋\nConfirma aquí:\nhttps://wit.app/invite/${guest.id}`,
              },
            }),
          }
        );

        const data = await res.json();

        results.push({
          guest: guest.id,
          success: res.ok,
          data,
        });

        // 🔥 delay para evitar bloqueos
        await new Promise((r) => setTimeout(r, 300));

      } catch (err) {
        results.push({
          guest: guest.id,
          success: false,
          error: err.message,
        });
      }
    }

    // ✅ RETURN SOLO AL FINAL
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});