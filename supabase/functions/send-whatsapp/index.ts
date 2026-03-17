import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN")
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_ID")

Deno.serve(async (req) => {
  try {
    const { phone, message } = await req.json()

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "phone and message are required" }),
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    )

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})