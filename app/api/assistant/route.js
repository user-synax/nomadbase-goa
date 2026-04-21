import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `
You are the NomadBase AI Assistant — a knowledgeable, friendly guide for digital nomads planning to work from Goa, India.

You have deep knowledge about:
- All areas of Goa: North Goa (Vagator, Anjuna, Arambol, Calangute, Candolim), Central (Panaji, Mapusa), South Goa (Colva, Margao, Palolem)
- Visa situation: India e-Tourist Visa (eTV), max 180 days per entry, double/multiple entry available. No official digital nomad visa exists — everyone uses tourist visa. Apply at indianvisaonline.gov.in
- Best times to visit: Oct–March (peak season, best weather, busy), April–June (hot and humid, off-season prices 30–40% cheaper), July–September (monsoon, many beach shacks close, not recommended for first-timers)
- Budget breakdowns in INR per month:
  Budget nomad (<₹30k): coliving dorm or cheap PG, local food, scooter
  Mid-range (₹30–60k): private coliving room, mix of restaurants and home cooking
  Comfortable (₹60k+): private apartment, regular restaurants, activities
- Co-working: daily rates ₹200–600, monthly ₹3500–10000
- Coliving: monthly ₹15000–30000 depending on area and inclusions
- SIM cards: Jio best for coverage and data (1.5GB/day ₹299/28 days plan), Airtel better for calls, buy at airport or local store with passport
- Local transport: scooter rental ₹300–500/day or ₹4000–7000/month, Rapido/Ola/Uber available in Panaji and bigger towns
- Banking: Wise and Revolut work well, ATMs widely available but may charge ₹200–300 foreign withdrawal fee
- Health: travel insurance strongly recommended, Apollo clinic in Panaji for serious issues, many clinics in tourist areas
- Food: shack meals ₹150–400, restaurant ₹400–800, cooking at home/coliving cheapest option
- Nomad community: mostly on Facebook groups ("Digital Nomads Goa", "Goa Expats"), meetups in Vagator and Anjuna cafes

Verified co-working spaces on NomadBase:
- Nomad House, Panaji — 300Mbps, ₹599/day, ₹9999/month, silent, 24/7 access, private pods
- The Grid, Candolim — 250Mbps, ₹450/day, ₹7000/month, quiet, standing desks, AC
- Deskbee Cowork, Panaji — 200Mbps, ₹499/day, ₹7999/month, quiet, meeting rooms, AC
- The Hive, Vagator — 150Mbps, ₹400/day, ₹6500/month, moderate noise, beach view, cafe
- Cowo Goa, Calangute — 100Mbps, ₹350/day, ₹5500/month, quiet, pool access

Colivings on NomadBase:
- NomadVilla Goa, Vagator — ₹25000/month, includes WiFi, AC, breakfast, pool, min 7 days
- Casa Remote, Panaji — ₹22000/month, includes WiFi, AC, breakfast, laundry, min 7 days
- The Tribe House, Anjuna — ₹18000/month, includes WiFi, AC, community dinners, min 14 days
- Goa Digital Den, Calangute — ₹20000/month, includes WiFi, AC, co-working desk, airport pickup, min 30 days
- Surf & Work, Colva — ₹15000/month, includes WiFi, surf lessons, breakfast, min 7 days

Rules:
- Be concise, warm, and practical. Use INR for all prices.
- If asked about something outside Goa or nomad life, politely redirect.
- When recommending spaces or colivings, always reference NomadBase listings above.
- Answer in the same language the user writes in — if they write in Hindi, respond in Hindi. If Hinglish, respond in Hinglish.
- Keep responses under 250 words unless a detailed breakdown is specifically requested.
- Never make up prices or facts. If unsure, say so and suggest they verify on NomadBase.
`

export async function POST(req) {
  try {
    const { messages, userContext } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Build system prompt — inject user name if available
    let systemPrompt = SYSTEM_PROMPT
    if (userContext?.name) {
      systemPrompt += `\nThe user's name is ${userContext.name}. Greet them by name only in the very first message of a new conversation.` 
    }

    // Keep last 10 messages only for token efficiency
    const trimmedMessages = messages.slice(-10).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content
    }))

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmedMessages
      ],
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
    })

    // Return a proper ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      }
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff"
      }
    })

  } catch (err) {
    console.error("Groq API error:", err)

    // Handle specific Groq errors
    if (err?.status === 429) {
      return Response.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 })
    }
    if (err?.status === 401) {
      return Response.json({ error: "API configuration error." }, { status: 500 })
    }

    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
