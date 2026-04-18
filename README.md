# Gendan — Profile Classification API

A REST API that accepts a name, queries external classification APIs (Genderize, Agify, Nationalize), and stores the enriched profile in a local MongoDB database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Hono
- **Language**: TypeScript
- **Validation**: Zod
- **Database**: MongoDB
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

## API Endpoints

### Create Profile

```
POST /api/profiles
Body: { "name": "ella" }
```

Returns `201` with the full profile on creation, or `200` with the existing profile if the name already exists.

### Get Single Profile

```
GET /api/profiles/:id
```

Returns `200` with the full profile, or `404` if not found.

### List All Profiles

```
GET /api/profiles?gender=male&country_id=NG&age_group=adult
```

All query parameters are optional and case-insensitive.

### Delete Profile

```
DELETE /api/profiles/:id
```

Returns `204` on success, or `404` if not found.

## Environment Variables

| Variable      | Default                     | Description          |
|---------------|-----------------------------|----------------------|
| `PORT`        | `3000`                      | Server port          |
| `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection URI |
| `DB_NAME`     | `gendan`                    | MongoDB database name |
