import { Hono } from "hono"
import { cors } from "hono/cors"
import { connectDb } from "@/db"
import { profileRoutes } from "@/routes/profiles"

export const app = new Hono()

app.use("*", cors({ origin: "*" }))
app.use("*", async (_c, next) => {
  await connectDb()
  await next()
})
app.route("/api/profiles", profileRoutes)
