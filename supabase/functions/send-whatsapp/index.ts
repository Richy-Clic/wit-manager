import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN")
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_ID")

const USE_TEMPLATE = false // 🔥 cambia a true cuando aprueben tu template

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req) => {
  // ✅ Preflight (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // ✅ Auth (recomendado para prod)
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: corsHeaders }
      )
    }

    // ✅ Parse body
    const { phone, message, templateName, params } = await req.json()

    if (!phone) {
      return new Response(
        JSON.stringify({ error: "phone is required" }),
        { status: 400, headers: corsHeaders }
      )
    }

    // 🔥 Construcción dinámica del payload
    let body

    if (USE_TEMPLATE) {
      if (!templateName || !params) {
        return new Response(
          JSON.stringify({ error: "templateName and params are required" }),
          { status: 400, headers: corsHeaders }
        )
      }

      body = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: templateName,
          language: { code: "es_MX" },
          components: [
            {
              type: "body",
              parameters: params.map((p: string) => ({
                type: "text",
                text: p,
              })),
            },
          ],
        },
      }
    } else {
      if (!message) {
        return new Response(
          JSON.stringify({ error: "message is required in text mode" }),
          { status: 400, headers: corsHeaders }
        )
      }

      body = {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: message,
        },
      }
    }

    // 🚀 Request a API de WhatsApp (Meta)
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()

    // ❌ Error de Meta
    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    }

    // ✅ Success
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Unexpected error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})