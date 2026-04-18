import { MongoClient, type Collection } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017"
const DB_NAME = process.env.DB_NAME ?? "gendan"

let profiles: Collection

export const connectDb = async () => {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(DB_NAME)
  profiles = db.collection("profiles")
  await profiles.createIndex(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
  )
  await profiles.createIndex({ id: 1 }, { unique: true })
}

export const getProfiles = () => profiles
