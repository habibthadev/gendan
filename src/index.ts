import "dotenv/config"
import { serve } from "@hono/node-server"
import { app } from "@/app"

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3000
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`Server running on port ${info.port}`)
  })
}

export default app
