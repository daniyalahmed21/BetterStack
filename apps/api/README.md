# API reference (apps/api)

This document lists the API routes exposed by the `apps/api` service, the request shapes, expected responses, and authentication requirements.

**Base URL (local dev):**

  http://localhost:3001


## Notes on authentication

- The auth endpoints are mounted under `/api/auth/*` and are provided by the `@repo/auth` package.
- The application uses session-based auth (cookies) and also supports passing session headers. The `requireAuth` middleware reads session information from incoming headers and will return `401` for unauthenticated requests.
- Examples below show both cookie-based and bearer/header-based approaches where applicable.


## Auth endpoints (mounted at `/api/auth/*`)

These routes are provided by the project's auth package. Common endpoints you can use during development include:

- POST /api/auth/sign-up/email — create a user with email & password
  - Body: `{ email: string, password: string, name?: string }`
  - Success: sets session cookies and returns session/user info (implementation-specific)
- POST /api/auth/sign-in/email — sign in with email & password
  - Body: `{ email: string, password: string }`
  - Success: sets session cookies and returns session/user info
- POST /api/auth/sign-out — sign out (clears session)
- GET /api/auth/session — returns current session info if authenticated

For a complete list and implementation details, see the `@repo/auth` package in the workspace.


## Health / simple test endpoint

- GET /api/auth/ok
  - Auth: Not required
  - Response: `200`
    - Body: `{ status: "ok" }`


## Websites resource (all routes require authentication)

The websites endpoints are mounted at `/websites` and are protected by `requireAuth`. The middleware populates `req.userId` and `req.session` for the authenticated user.

### 1) Create website

- POST /websites
- Auth: required (cookie or session headers)
- Request JSON body:
  - `{ "url": "https://example.com" }`
- Success:
  - Status: `201`
  - Body: website object (database model) — example:

```json
{
  "id": "<uuid>",
  "url": "https://example.com",
  "userId": "<user-id>",
  "createdAt": "2025-12-29T...",
  "updatedAt": "2025-12-29T..."
}
```

- Errors:
  - `400`: `{ "error": "URL is required" }`
  - `401`: `{ "error": "Unauthorized" }`
  - `409`: `{ "error": "Website already exists" }`
  - `500`: `{ "error": "Failed to create website" }`

### 2) List websites

- GET /websites
- Auth: required
- Request: none
- Success:
  - Status: `200`
  - Body: array of website objects (ordered by `createdAt` desc). Example:

```json
[
  { "id": "...", "url": "...", "userId": "...", "createdAt": "..." },
  { "id": "...", "url": "...", "userId": "...", "createdAt": "..." }
]
```

### 3) Get single website

- GET /websites/:id
- Auth: required
- Request params: `id` — website id
- Success:
  - Status: `200`
  - Body: website object with `ticks` (latest 10 ticks included). Example:

```json
{
  "id": "...",
  "url": "...",
  "userId": "...",
  "ticks": [ { "id": "...", "status": "up|down", "createdAt": "..." }, ... ]
}
```

- Errors:
  - `404`: `{ "error": "Website not found" }`

### 4) Update website

- PUT /websites/:id
- Auth: required
- Request params: `id` — website id
- Request body: `{ "url": "https://new-url.com" }`
- Success:
  - Status: `200`
  - Body: `{ "success": true }`
- Errors:
  - `400`: `{ "error": "URL is required" }`
  - `404`: `{ "error": "Website not found" }`
  - `500`: `{ "error": "Failed to update website" }`

### 5) Delete website

- DELETE /websites/:id
- Auth: required
- Request params: `id` — website id
- Success:
  - Status: `200`
  - Body: `{ "success": true }`
- Errors:
  - `404`: `{ "error": "Website not found" }`


## Authentication examples

- Using cookies (typical flow from auth package):

  1) Sign up (creates a session cookie):

  ```powershell
  curl -X POST http://localhost:3001/api/auth/sign-up/email \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123","name":"Test"}' \
    -c cookies.txt
  ```

  2) Use saved cookies to call protected route:

  ```powershell
  curl -X GET http://localhost:3001/websites -b cookies.txt
  ```

- Using session headers (if you have a token or header-based session):

```powershell
curl -X GET http://localhost:3001/websites \
  -H "Authorization: Bearer <session-token>"
```

## Error format

- The API returns JSON error objects for non-success responses, for example:
  - `{ "error": "Unauthorized" }`
  - `{ "error": "Website not found" }`


## Step 2: Test Sign Up

First, create a user account:

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Response will include cookies with session tokens.

## Step 3: Test Sign In

```bash
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

The `-c cookies.txt` flag saves cookies to a file.

## Step 4: Test Protected Route with Cookies

Using the saved cookies:

```bash
curl -X GET http://localhost:3001/websites \
  -b cookies.txt
```

Or test creating a website:

```bash
curl -X POST http://localhost:3001/websites \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "url": "https://example.com"
  }'
```
