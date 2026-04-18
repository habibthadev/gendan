import { getProfiles } from "@/db"
import { v7 as uuidv7 } from "uuid"

type Profile = {
  id: string
  name: string
  gender: string
  gender_probability: number
  sample_size: number
  age: number
  age_group: string
  country_id: string
  country_probability: number
  created_at: string
}

type ProfileSummary = {
  id: string
  name: string
  gender: string
  age: number
  age_group: string
  country_id: string
}

type ProfileInput = Omit<Profile, "id" | "created_at">

const COLLATION = { locale: "en", strength: 2 } as const
const NO_ID = { _id: 0 } as const
const SUMMARY_PROJECTION = { _id: 0, gender_probability: 0, sample_size: 0, country_probability: 0, created_at: 0 } as const

export const findByName = async (name: string): Promise<Profile | null> =>
  getProfiles().findOne({ name }, { projection: NO_ID, collation: COLLATION }) as Promise<Profile | null>

export const findById = async (id: string): Promise<Profile | null> =>
  getProfiles().findOne({ id }, { projection: NO_ID }) as Promise<Profile | null>

export const insert = async (input: ProfileInput): Promise<Profile> => {
  const id = uuidv7()
  const created_at = new Date().toISOString()
  const profile: Profile = { id, ...input, created_at }
  await getProfiles().insertOne({ ...profile })
  return profile
}

export const findAll = async (filters: {
  gender?: string
  country_id?: string
  age_group?: string
}): Promise<ProfileSummary[]> => {
  const query: Record<string, string> = {}

  if (filters.gender) query.gender = filters.gender
  if (filters.country_id) query.country_id = filters.country_id
  if (filters.age_group) query.age_group = filters.age_group

  return getProfiles()
    .find(query, { projection: SUMMARY_PROJECTION })
    .collation(COLLATION)
    .toArray() as unknown as Promise<ProfileSummary[]>
}

export const remove = async (id: string): Promise<boolean> => {
  const result = await getProfiles().deleteOne({ id })
  return result.deletedCount > 0
}
