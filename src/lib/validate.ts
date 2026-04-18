import { z } from "zod"

type ValidationSuccess = { name: string }
type ValidationError = { status: 400 | 422; message: string }
type ValidationResult = ValidationSuccess | ValidationError

export const isError = (
  result: ValidationResult
): result is ValidationError => "status" in result

export const validateCreateBody = (body: unknown): ValidationResult => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { status: 400, message: "Name is required" }
  }

  const obj = body as Record<string, unknown>

  if (!("name" in obj) || obj.name === undefined || obj.name === null || obj.name === "") {
    return { status: 400, message: "Name is required" }
  }

  if (typeof obj.name !== "string") {
    return { status: 422, message: "Invalid type" }
  }

  const trimmed = obj.name.trim()
  if (trimmed === "") {
    return { status: 400, message: "Name is required" }
  }

  return { name: trimmed }
}

export const queryFiltersSchema = z.object({
  gender: z.string().optional(),
  country_id: z.string().optional(),
  age_group: z.string().optional(),
})
