# 01. The backend

From the authentication slides (pages 004 to 006).

A small Express backend with the exact routes the slides use. Users and courses
live in memory, so there is nothing to install or seed. The two frontend
folders talk to it.

## Run it

Install once from the Lab8 folder (see the main README), then here:

```bash
npm start
```

It runs on `http://localhost:4000`. In a second terminal:

```bash
npm run demo
```

## Accounts

| Email | Password | Role |
|---|---|---|
| ahmed@giu-uni.de | student123 | student |
| mona@giu-uni.de | student123 | student |
| nada@giu-uni.de | admin123 | admin |

## Routes

| Method | Route | Who |
|---|---|---|
| POST | `/auth/login` | anyone, sets the `token` cookie |
| POST | `/auth/logout` | anyone, clears it |
| GET | `/auth/me` | logged in |
| GET | `/students/:id/courses` | that student, or an admin |
| GET | `/courses` | admin |

The token is read from the cookie (the browser) or from an
`Authorization: Bearer` header (the Next.js server, slide 019).

## Worth showing

`npm run demo` prints the real response from slide 005:

```
Set-Cookie: token=eyJhbGciOi...; Max-Age=60; Path=/; HttpOnly; SameSite=Lax
```

Walk it attribute by attribute with the table on the slide. Then the rest of the
output is the whole lesson in status codes:

```
GET  /auth/me              401  no cookie yet
POST /auth/login           401  wrong password
POST /auth/login           200  Set-Cookie
GET  /auth/me              200  Ahmed
GET  /students/1/courses   200  his own courses
GET  /students/2/courses   403  someone else's
GET  /courses              403  admins only
```

**Logins last 60 seconds on purpose**, so the "authentication expiry" slides
can be shown live. Change it with `TOKEN_SECONDS`, for example
`TOKEN_SECONDS=600 npm start` (on Windows PowerShell:
`$env:TOKEN_SECONDS=600; npm start`).

**Secure is off.** The slide's cookie has `Secure`, which means HTTPS only.
Browsers make an exception for `localhost`, so it would work, but it is left off
here to keep the demo simple. Turn it on in production.
