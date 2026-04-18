type GenderizeResponse = {
  count: number
  name: string
  gender: string | null
  probability: number
}

type AgifyResponse = {
  count: number
  name: string
  age: number | null
}

type NationalizeResponse = {
  count: number
  name: string
  country: Array<{ country_id: string; probability: number }>
}

type ExternalData = {
  gender: string
  gender_probability: number
  sample_size: number
  age: number
  country_id: string
  country_probability: number
}

type FetchResult = { data: ExternalData } | { error: string }

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchExternalApis = async (name: string): Promise<FetchResult> => {
  const encoded = encodeURIComponent(name)

  let genderize: GenderizeResponse
  let agify: AgifyResponse
  let nationalize: NationalizeResponse

  try {
    ;[genderize, agify, nationalize] = await Promise.all([
      fetchJson<GenderizeResponse>(`https://api.genderize.io?name=${encoded}`),
      fetchJson<AgifyResponse>(`https://api.agify.io?name=${encoded}`),
      fetchJson<NationalizeResponse>(`https://api.nationalize.io?name=${encoded}`),
    ])
  } catch {
    return { error: "External API request failed" }
  }

  if (!genderize.gender || genderize.count === 0) {
    return { error: "Genderize returned an invalid response" }
  }

  if (agify.age === null || agify.age === undefined) {
    return { error: "Agify returned an invalid response" }
  }

  if (!nationalize.country || nationalize.country.length === 0) {
    return { error: "Nationalize returned an invalid response" }
  }

  const topCountry = nationalize.country.reduce((max, c) =>
    c.probability > max.probability ? c : max
  )

  return {
    data: {
      gender: genderize.gender,
      gender_probability: genderize.probability,
      sample_size: genderize.count,
      age: agify.age,
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
    },
  }
}
