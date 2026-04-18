import { Hono } from "hono"
import { validateCreateBody, isError, queryFiltersSchema } from "../lib/validate"
import { classifyAge } from "../lib/classify"
import { fetchExternalApis } from "../services/external-apis"
import * as profileService from "../services/profiles"

export const profileRoutes = new Hono()

profileRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null)
  const validation = validateCreateBody(body)

  if (isError(validation)) {
    return c.json({ status: "error", message: validation.message }, validation.status)
  }

  const existing = await profileService.findByName(validation.name)
  if (existing) {
    return c.json(
      { status: "success", message: "Profile already exists", data: existing },
      200
    )
  }

  const result = await fetchExternalApis(validation.name)
  if ("error" in result) {
    return c.json({ status: "error", message: result.error }, 502)
  }

  const profile = await profileService.insert({
    name: validation.name,
    ...result.data,
    age_group: classifyAge(result.data.age),
  })

  return c.json({ status: "success", data: profile }, 201)
})

profileRoutes.get("/", async (c) => {
  const parsed = queryFiltersSchema.safeParse(c.req.query())
  if (!parsed.success) {
    return c.json({ status: "error", message: "Invalid query parameters" }, 400)
  }

  const profiles = await profileService.findAll(parsed.data)
  return c.json({ status: "success", count: profiles.length, data: profiles })
})

profileRoutes.get("/:id", async (c) => {
  const profile = await profileService.findById(c.req.param("id"))
  if (!profile) {
    return c.json({ status: "error", message: "Profile not found" }, 404)
  }
  return c.json({ status: "success", data: profile })
})

profileRoutes.delete("/:id", async (c) => {
  const deleted = await profileService.remove(c.req.param("id"))
  if (!deleted) {
    return c.json({ status: "error", message: "Profile not found" }, 404)
  }
  return c.body(null, 204)
})
