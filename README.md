# TinyUrl — Create and manage your short links

TinyUrl is a simple URL shortening service with a minimal frontend and a TypeScript + Express backend. Create short links, optionally provide a custom code (6–8 alphanumeric chars), and share them — visiting /:code redirects to the original long URL.

Live demo
- Backend: https://tinyurl-00zi.onrender.com
- Frontend: https://tiny-url-six-sand.vercel.app/
NOTE: For First request to response, initially it might take some time to response because render automatically shut if no request hit on server till 15 min.

Tech stack
- Backend: Node.js, Express.js, TypeScript
- ORM / DB: Prisma (NeonDB / Postgres)
- Frontend: Next.js (React)
- Deployments: Render / Vercel (example)

Quick highlights (endpoints)
- GET /healthz
  - Health check (service is up)
  - Example: GET https://tinyurl-00zi.onrender.com/healthz
- POST /api/links
  - Create a new short link
  - Body: { "longUrl": "<long url>", "code": "<optional custom code (6-8 alnum)>" }
  - Returns created record (including generated code / shortUrl)
- GET /api/links
  - List links (for user / admin usage; in demo it returns created links)
- GET /api/links/:code
  - Get metadata for a given code (long URL, createdAt, hits, etc.)
- GET /:code
  - Redirect endpoint: 302 -> the original long URL for the provided code

Notes about codes and redirect behavior
- Custom code rules:
  - Optional on creation.
  - Must be 6–8 characters long.
  - Letters and numbers only (alphanumeric).
  - If omitted, a random 6–8 char alphanumeric code is generated.
- Redirect:
  - GET /:code looks up the code and responds with an HTTP 302 redirect to the long URL.
  - If code not found, the API returns 404 (or the frontend shows a not-found page).

API examples (curl)
- Health check
  - curl -i https://tinyurl-00zi.onrender.com/healthz
  - Example response:
    - HTTP/1.1 200 OK
    - { "status": "ok", "uptime": 123456 }
- Create a link (with generated code)
  - curl -X POST https://tinyurl-00zi.onrender.com/api/links \
    -H "Content-Type: application/json" \
    -d '{"longUrl":"https://example.com/some/very/long/path"}'
  - Example response:
    - { "code": "a1b2c3"}
- Create a link (with custom code)
  - curl -X POST https://tinyurl-00zi.onrender.com/api/links \
    -H "Content-Type: application/json" \
    -d '{"longUrl":"https://example.com","code":"mycode1"}'
- Get link metadata
  - curl https://tinyurl-00zi.onrender.com/api/links/mycode1
- Redirect via code (browser or curl)
  - Open https://tinyurl-00zi.onrender.com/mycode1
  - curl -I https://tinyurl-00zi.onrender.com/mycode1
    - Expect 302 Location: https://example.com

Local setup — Backend (development)
1. Clone
   - git clone https://github.com/s-mahali/tinyURL.git
   - cd tinyURL/backend (or the repo root if mono-repo)
2. Install
   - npm install
3. Environment variables
   - Create a `.env` file (example variables below)
     - DATABASE_URL="postgresql://<user>:<pass>@<host>:5432/<db>?schema=public"  # NeonDB connection string
     - PORT=8080
     - APP_URL="http://localhost:8080"  # used when building shortUrl
     - (optional) OTHER variables as required by the project
4. Prisma setup
   - npx prisma generate
   - npx prisma migrate dev --name init   # or prisma db push if you don't want migrations
   - (If using Neon/remote DB, use `prisma migrate deploy` after pushing migration files)
5. Run
   - npm run dev
   - Backend should be available at http://localhost:8080 (or your PORT)
6. Common commands
   - npm run build
   - npm start

Local setup — Frontend (Next.js)
1. cd frontend (or the next app directory)
2. npm install
3. Environment variables
   - Create `.env.local` (example):
     - NEXT_PUBLIC_API_URL=http://localhost:8080
4. Run frontend
   - npm run dev
   - Open http://localhost:3000

Prisma schema & NeonDB
- This project uses Prisma as the ORM and expects a Postgres-compatible database (NeonDB recommended in cloud deployment).
- DATABASE_URL should point to NeonDB or another Postgres instance.
- After changing the Prisma schema:
  - npx prisma migrate dev --name <migration_name>
  - npx prisma generate

Deployment notes
- Backend: tested / example deployed at Render: https://tinyurl-00zi.onrender.com
  - Ensure you set DATABASE_URL and any other secrets in Render.
  - Use `npm run build` and `npm start` for production.
- Frontend: example deployment at Vercel: https://tiny-url-six-sand.vercel.app/
  - Set NEXT_PUBLIC_API_URL to the backend production URL.

Data model & behaviors (summary)
- Link record fields (typical)
  - id (int)
  - code (string, unique)
  - longUrl (string)
  - shortUrl (computed from APP_URL + code)
  - createdAt, updatedAt
  - hits (optional — increment on redirect)
- Concurrency/uniqueness
  - Custom code collisions return 409 / error.
  - Generated codes check uniqueness before persisting.

Security & considerations
- Validate user-provided long URLs before saving.
- Rate limiting / abuse protection recommended for production.


Troubleshooting
- Prisma errors: check DATABASE_URL, run `npx prisma db pull` to validate, then `npx prisma migrate dev`.
- Port conflicts: ensure PORT env var not in use.
- Redirects not working: check that the code exists and the redirect uses a proper 302 response.

Contact / Author
- Project in repository: https://github.com/s-mahali/tinyURL

