import { Hono } from "hono"
import { cors } from "hono/cors"
import { profileRoutes } from "@/routes/profiles"

export const app = new Hono()

app.use("*", cors({ origin: "*" }))
app.route("/api/profiles", profileRoutes)
