import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
console.log("METHOD:", req.method)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  
  const { guests, wedding_id } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  )

  const groupMap = getGroupMap(guests)

  await insertGroups(supabase, groupMap, wedding_id)

  const guestsFormatted = getGuestsFormatted(guests, wedding_id, groupMap);
  console.log("guestsFormatted", guestsFormatted)

  const { error } = await supabase
    .from("guests")
    .insert(guestsFormatted)
    .select()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )
  }

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  )
})

function getGroupMap(guests) {

  const groupMap = {}

  guests.forEach((g) => {
    if (!g.pareja) {
      groupMap[g.n] = crypto.randomUUID()
    }
  })

  return groupMap
}

function getGuestsFormatted(guests, wedding_id, groupMap) {

  return guests.map((g) => {

    const isMain = !g.pareja

    const groupId = isMain
      ? groupMap[g.n]
      : groupMap[g.pareja]

    return {
      id: crypto.randomUUID(),
      name: g.nombre,
      phone: g.telefono,
      wedding_id,
      group_id: groupId,
      is_main: isMain
    }
  })
}

async function insertGroups(supabase, groupMap, wedding_id) {

  const groups = Object.values(groupMap).map((groupId) => ({
    id: groupId,
    wedding_id
  }))

  await supabase
    .from("groups")
    .insert(groups)
}