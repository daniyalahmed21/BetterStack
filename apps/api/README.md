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
