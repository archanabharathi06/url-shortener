# Sniplink 

Sniplink is a production-quality MERN stack URL Shortener SaaS application. It enables users to secure login credentials, generate shortened links with custom aliases and expiration parameters, generate downloadable visual QR codes, and trace granular user-agent redirect statistics through interactive dashboards.

---

## Tech Stack & Versioning

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) | `^18.2.0` | UI Core Framework |
| | Tailwind CSS | `^3.4.3` | Responsive layout styling |
| | Recharts | `^2.12.5` | Trend activity visualization |
| | React Router DOM | `^6.22.3` | Client page routing & guards |
| | Axios | `^1.6.8` | HTTP Client for API calls |
| | React Hook Form | `^7.51.2` | Client validation controller |
| | Zod | `^3.22.4` | Form validation parsing schema |
| | QRCode.React | `^3.1.0` | PNG downloadable QR render |
| **Backend** | Node.js | `>=18.0.0` | Server runtime engine |
| | Express.js | `^4.19.2` | REST API Routing Framework |
| | Mongoose (MongoDB) | `^8.3.1` | Database ODM mapping |
| | JWT (jsonwebtoken) | `^9.0.2` | Session authentication token |
| | BcryptJS | `^2.4.3` | Password encryption utility |
| | UA-Parser-JS | `^1.0.37` | Visitor client user-agent parse |
| | Express Rate Limit | `^7.2.0` | DDOS protection on link create |

---

## Architecture Design

```
                     +---------------------------------------+
                     |         React Client (Vite)           |
                     |         (http://localhost:5173)       |
                     +-------------------+-------------------+
                                         |
                                  Axios requests
                                         v
                     +-------------------+-------------------+
                     |      Express Server / API             |
                     |         (http://localhost:5000)       |
                     +--+-------------------+-------------+--+
                        |                   |             |
                 Auth Middleware     Rate Limiter    UA Parser
                        |                   |             |
                        v                   v             v
                     +--+-------------------+-------------+--+
                     |         MongoDB Atlas / Local         |
                     |         (mongodb://127.0.0.1:27017)   |
                     +---------------------------------------+
```

---

## Key Assumptions

1. **Short Code Generation**: Unique auto-generated short codes are 7-characters long, compiled using cryptographically secure random alphanumeric selections (`[a-zA-Z0-9]`).
2. **Redirect Flow**: Short code redirects are handled by the backend at root level (`GET /:shortCode`) returning a standard `302 Found` header instead of a `301 Moved Permanently` to prevent client browser caching and guarantee click analytics verification on repeating visits.
3. **Soft Deletions**: Deleting URLs sets `isActive = false` in the database. Deactivated links immediately throw 404 redirects and disappear from dashboards but remain in data records for historical analytics validation.
4. **Link Expiration**: Expiration dates are checked dynamically on redirect. If `expiresAt` is in the past, visitors are redirected to the client 404 page with a visual expiration notice banner.

---

## Prerequisites

- **Node.js** >= `18.0.0` installed
- **MongoDB** running locally (`127.0.0.1:27017`) or an Atlas cluster connection URI

---

## Step-by-Step Installation & Setup

### 1. Clone & Setup Backend Env
Navigate to the `backend/` directory, copy `.env.example` to `.env`, and customize parameters:
```bash
cd backend
copy .env.example .env
```
Ensure MongoDB connection parameters and `JWT_SECRET` keys are set.

### 2. Install Backend Dependencies & Run Seed
Install libraries and run the database seeder to immediately populate a demo profile and analytics:
```bash
npm install
npm run seed
```

### 3. Run Backend API Server
Start the backend development listener at `http://localhost:5000`:
```bash
npm run dev
```

### 4. Setup Frontend Env
Navigate to the `frontend/` directory, copy `.env.example` to `.env`:
```bash
cd ../frontend
copy .env.example .env
```

### 5. Install Frontend Dependencies & Launch Client
Install packages and start the Vite dev server at `http://localhost:5173`:
```bash
npm install
npm run dev
```

### 6. Test Demo Login
Access the login page at `http://localhost:5173/login` and authenticate using:
- **Email**: `demo@sniplink.com`
- **Password**: `password123`

---

## API Endpoints List

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| **POST** | `/signup` | No | Creates a user profile, returns JWT session token. |
| **POST** | `/login` | No | Validates credentials, returns JWT session token. |
| **GET** | `/me` | Yes | Fetches authenticated user info. |

### Link Operations — `/api/urls`
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| **GET** | `/` | Yes | Lists user's active links (paginated). |
| **POST** | `/` | Yes | Shortens a URL (validates formatting, applies 20 req/min limits). |
| **PATCH** | `/:id` | Yes | Updates destination URL or custom alias (verifies owner). |
| **DELETE** | `/:id` | Yes | Marks a URL as inactive (soft delete, verifies owner). |
| **GET** | `/:id/qr` | Yes | Generates QR code target string. |

### Analytics — `/api/analytics`
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| **GET** | `/:urlId` | Yes | Fetches URL stats, device counts, and recent visit lists. |
| **GET** | `/:urlId/chart` | Yes | Aggregates daily click trends for the last 30 days. |
| **GET** | `/:urlId/visits` | Yes | Fetches full, detailed visitor redirection logs (paginated). |

### Public & Redirections
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| **GET** | `/api/public/:shortCode/stats` | No | Fetches sanitized performance trends (no IP detail). |
| **GET** | `/:shortCode` | No | Server-side 302 redirect tracking user-agent patterns. |

---

## AI Prompt Logs (Interview Prep)

The following primary prompts were utilized during code generation:
1. *Setup schema structure with strict indexes on unique shortCode and customAlias to support high-performance lookups.*
2. *Configure express-rate-limit middleware to prevent creation spam, limiting IPs to 20 request additions per minute.*
3. *Implement server-side user agent parsing (using ua-parser-js) during redirects to record browser and device metrics.*
4. *Formulate a MongoDB aggregation pipeline filling chronological date gaps with zero values for the 30-day click trends charts.*

---

## Demo Video
[Link](https://youtu.be/X2SO-_8FLyA?si=k4FSA5N04wnv-UX3)

This project is a part of a hackathon run by https://katomaran.com
