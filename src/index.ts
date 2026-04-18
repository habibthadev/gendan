import "dotenv/config"
import { serve } from "@hono/node-server"
import { app } from "@/app"
import { connectDb } from "@/db"

const port = Number(process.env.PORT) || 3000

const start = async () => {
  await connectDb()
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`Server running on port ${info.port}`)
  })
}

start()
