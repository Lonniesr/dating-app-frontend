import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response("Invalid prompt", { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const fakeChunks = [
          "Thinking… ",
          "Analyzing your data… ",
          "Generating insights… ",
          "Here’s what I found: ",
          "Your admin system is running smoothly.",
        ];

        for (const chunk of fakeChunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
          await new Promise((r) => setTimeout(r, 300));
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return new Response("Error processing request", { status: 500 });
  }
});