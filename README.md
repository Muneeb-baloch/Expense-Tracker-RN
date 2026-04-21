# Expense Tracker

A full-stack expense tracking app built with React Native (Expo) and Node.js.

## Tech Stack

**Backend**
- Node.js + Express.js (ESM)
- PostgreSQL via [Neon](https://neon.tech) serverless
- Rate limiting via [Upstash](https://upstash.com) Redis
- dotenv for environment config

**Mobile** *(coming soon)*
- React Native with Expo
- Clerk for authentication

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.js           # Neon PostgreSQL connection
│       │   └── upstash.js      # Upstash Redis rate limiter config
│       ├── controllers/
│       │   └── transactionController.js
│       ├── middleware/
│       │   └── rateLimiter.js  # 4 requests per 60s sliding window
│       ├── routes/
│       │   └── transcationRoutes.js
│       └── server.js
└── mobile/                     # React Native app (coming soon)
```

## Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- An [Upstash](https://upstash.com) Redis database

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5001
DATABASE_URL=your_neon_postgres_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/:user_id` | Get all transactions for a user |
| POST | `/api/transactions` | Create a new transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/transactions/summary/:userId` | Get balance, income & expense summary |

### POST /api/transactions — Request Body

```json
{
  "user_id": "123",
  "title": "Salary",
  "amount": 1500,
  "category": "income"
}
```

## Rate Limiting

All endpoints are rate limited to **4 requests per 60 seconds** per instance using Upstash Redis sliding window algorithm. Exceeding the limit returns a `429 Too Many Requests` response.
