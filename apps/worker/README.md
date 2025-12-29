# Uptime Worker

A Redis-based distributed worker service that monitors website uptime and stores health metrics. Part of the BetterStack monorepo.

## Overview

The Uptime Worker is a background job processor that:
- Consumes monitoring jobs from a Redis stream
- Performs HTTP health checks on websites
- Records response times and uptime status
- Stores results in the database via Prisma
- Supports horizontal scaling with Redis consumer groups

## Architecture

### Components

- **Redis Stream**: `uptime:jobs` - Queue for monitoring tasks
- **Consumer Group**: `uptime-group` - Manages distributed processing
- **Worker Process**: Consumes and processes jobs with automatic retries
- **Database**: Stores `WebsiteTick` records with uptime metrics

### Flow

```
1. API receives monitoring request
2. Job added to Redis stream: uptime:jobs
3. Worker consumes job from consumer group
4. Worker performs HTTP GET request to target URL
5. Result stored in database as WebsiteTick
6. Job acknowledged in Redis (auto-retry on failure)
```

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL/MySQL database
- Redis server running

### Installation

From the monorepo root:

```bash
pnpm install
```

### Environment Variables

Create `.env` or `.env.local` in your monorepo root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/betterstack"

# Redis
REDIS_URL="redis://localhost:6379"
# or individual settings:
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0
```

## Running the Worker

### Development

```bash
pnpm --filter worker dev
```

Starts the worker in watch mode with automatic reload on file changes.

### Production

```bash
pnpm --filter worker build
pnpm --filter worker start
```

### Multiple Workers

You can run multiple workers to process jobs in parallel:

```bash
# Terminal 1
pnpm --filter worker start

# Terminal 2
pnpm --filter worker start

# Terminal 3
pnpm --filter worker start
```

Each worker will automatically distribute jobs via Redis consumer groups. Jobs are never processed twice.

## Usage

### Adding a Monitoring Job

From your API or application:

```typescript
import { redis } from "./redisClient";

// Add a job to the queue
await redis.xAdd(
  "uptime:jobs",
  "*",
  {
    websiteId: "site-123",
    url: "https://example.com",
  }
);
```

### Job Format

```json
{
  "websiteId": "unique-website-id",
  "url": "https://example.com"
}
```

**Required fields:**
- `websiteId` (string): Unique identifier for the website
- `url` (string): Full URL to monitor (must be valid HTTP/HTTPS)

### API Integration Example

```typescript
// In your Express API
app.post("/api/websites/:id/monitor", async (req, res) => {
  const { url } = req.body;
  const websiteId = req.params.id;

  // Add to monitoring queue
  await redis.xAdd("uptime:jobs", "*", {
    websiteId,
    url,
  });

  res.json({ status: "monitoring_queued" });
});
```

## How It Works

### Job Processing

1. **Consume**: Worker reads pending jobs from Redis stream
2. **Validate**: Checks for required fields (websiteId, url)
3. **Monitor**: Makes HTTP GET request with 10-second timeout
4. **Record**: Stores result in database:
   - `websiteId`: Linked to website
   - `status`: "Up", "Down", or "Unknown"
   - `responseTimeMs`: Request duration
   - `regionId`: Region (default: "default-region")
5. **Acknowledge**: Marks job as complete in Redis

### Failure Handling

- **Network errors**: Status set to "Down"
- **Timeouts** (>10s): Status set to "Down"
- **Validation errors**: Job logged, not acknowledged, will retry
- **Database errors**: Job not acknowledged, will retry later

## Monitoring

### Check Worker Status

```bash
# List pending jobs
redis-cli XLEN uptime:jobs

# Check consumer group info
redis-cli XINFO GROUPS uptime:jobs

# Monitor consumer activity
redis-cli XINFO CONSUMERS uptime:jobs uptime-group
```

### Logs

The worker outputs logs to stdout:

```
Worker worker-12345 started
Job processed: 1704067200000-0
Job processed: 1704067201000-0
Job failed: 1704067202000-0
```

### Database Queries

View recent uptime checks:

```sql
SELECT * FROM "WebsiteTick"
WHERE "websiteId" = 'site-123'
ORDER BY "createdAt" DESC
LIMIT 10;

-- Get uptime percentage for a website
SELECT
  "websiteId",
  COUNT(*) as total_checks,
  SUM(CASE WHEN status = 'Up' THEN 1 ELSE 0 END) as up_checks,
  ROUND(100.0 * SUM(CASE WHEN status = 'Up' THEN 1 ELSE 0 END) / COUNT(*), 2) as uptime_percent,
  AVG("responseTimeMs") as avg_response_time_ms
FROM "WebsiteTick"
WHERE "websiteId" = 'site-123'
  AND "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY "websiteId";
```

## Configuration

### Timeout

Default HTTP request timeout: **10 seconds**

Modify in `src/index.ts`:

```typescript
await axios.get(url, { timeout: 15000 }); // 15 seconds
```

### Batch Size

Default jobs per batch: **10**

Modify in `src/index.ts`:

```typescript
const entries = await redis.xReadGroup(GROUP, CONSUMER, [...], {
  COUNT: 20, // Process 20 jobs at a time
  BLOCK: 5000,
});
```

### Block Timeout

Default block timeout: **5 seconds**

Workers will wait up to 5 seconds for new jobs before checking again.

## Scaling

### Horizontal Scaling

The worker uses Redis consumer groups for distributed processing:

```bash
# Start 3 workers
for i in 1 2 3; do
  pnpm --filter worker start &
done
```

Each worker:
- Gets a unique consumer ID
- Processes jobs independently
- Never processes the same job twice
- Automatically balances load

### Performance Tips

1. **Increase batch size** for high throughput
2. **Run multiple workers** for parallel processing
3. **Use regional workers** by setting `regionId` in job data
4. **Monitor Redis memory** - trim old stream entries
5. **Index database columns** - `websiteId`, `createdAt`, `status`

## Troubleshooting

### Worker Not Starting

```bash
# Check Redis connection
redis-cli PING
# Should return: PONG

# Check database connection
pnpm --filter db run db:push
```

### Jobs Not Processing

```bash
# Check pending jobs
redis-cli XLEN uptime:jobs

# Check consumer group
redis-cli XINFO GROUPS uptime:jobs

# Check for consumer group errors
redis-cli XINFO CONSUMERS uptime:jobs uptime-group
```

### High Memory Usage

```bash
# Trim old stream entries (keep last 10000)
redis-cli XTRIM uptime:jobs MAXLEN ~ 10000
```

### Database Connection Issues

```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test connection
pnpm --filter db run db:push
```

## Development

### Project Structure

```
apps/worker/
├── src/
│   └── index.ts          # Main worker logic
├── package.json
├── tsconfig.json
└── README.md

packages/db/              # Prisma database client
packages/auth/            # Authentication (if needed)
```

### Testing Jobs Locally

Create a test script `test-worker.ts`:

```typescript
import { redis } from "./redisClient";

async function addTestJob() {
  const jobId = await redis.xAdd("uptime:jobs", "*", {
    websiteId: "test-site",
    url: "https://google.com",
  });
  console.log("Job added:", jobId);
}

addTestJob().catch(console.error);
```

Run with:

```bash
pnpm exec ts-node test-worker.ts
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied (`pnpm db:push`)
- [ ] Redis server running and accessible
- [ ] Worker process manager configured (PM2, systemd, etc.)
- [ ] Monitoring/alerting setup
- [ ] Log aggregation configured
- [ ] Database backups enabled
- [ ] Redis persistence configured
- [ ] Worker auto-restart on failure
- [ ] Error notifications setup

## PM2 Configuration

Save as `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "uptime-worker",
      script: "dist/index.js",
      instances: 3,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
```

Start with:

```bash
pnpm add -D pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## API Reference

### Data Models

#### WebsiteTick

```prisma
model WebsiteTick {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id])
  regionId    String   @default("default-region")
  status      String   // "Up" | "Down" | "Unknown"
  responseTimeMs Int
  createdAt   DateTime @default(now())
}
```

## Contributing

1. Create a feature branch
2. Make changes to `src/index.ts`
3. Test with local Redis and database
4. Run type check: `pnpm tsc --noEmit`
5. Submit PR

## License

Part of the BetterStack project.