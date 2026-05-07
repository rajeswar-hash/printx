# PrintX

PrintX is a standalone campus printing platform built separately from CampusKart. Students upload documents, choose printing options, pay online, and receive printed documents the next day through their class representative.

## Project structure

- `src/`: React + Tailwind frontend prototype with landing page, auth, dashboards, upload flow, payment summary, and tracking UI
- `server/`: dedicated Node.js + Express + MongoDB backend scaffold for PrintX only

## Frontend

The current frontend is a production-style UI prototype with:

- landing page sections for hero, how it works, pricing, why choose us, testimonials, and FAQ
- student signup and login screens
- student dashboard and order tracking
- upload order page with automatic price calculation
- admin dashboard with search and filters
- CR dashboard with delivery workflow
- dark mode toggle and motion-driven UI

## Backend

The backend scaffold includes:

- JWT auth routes
- MongoDB user and order models
- Razorpay order creation endpoint
- role-aware admin and CR order status actions

## Environment

Create your backend environment from:

- [server/.env.example](C:\Users\rajes\OneDrive\Documents\New%20project\printx\server\.env.example)

This backend is intentionally separate from CampusKart. Do not reuse CampusKart database credentials.
