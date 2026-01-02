# Monitoring System Setup

## Issues Found and Fixed

### 1. ✅ Data Leakage Between Users (FIXED)
**Problem**: The authentication middleware had a dangerous development fallback that used the first user in the database for all unauthenticated requests. This caused:
- Users seeing each other's monitors
- Data not being properly isolated by userId

**Fix**: Removed the fallback. Now proper authentication is required for all requests.

### 2. ⚠️ Monitors Not Being Checked (REQUIRES REDIS)
**Problem**: Monitors stay in "Unknown" status because the monitoring system requires Redis to be running.

**How it works**:
1. API scheduler (every minute) → Queues monitoring jobs to Redis
2. Worker consumes jobs from Redis → Checks websites
3. Worker stores results → Updates database

## Redis Setup

### Windows Installation

#### Option 1: Using WSL2 (Recommended)
```bash
# Install WSL2 if not already installed
wsl --install

# Inside WSL2, install Redis
sudo apt update
sudo apt install redis-server

# Start Redis
sudo service redis-server start

# Test
redis-cli ping  # Should return PONG
```

#### Option 2: Using Docker
```bash
# Pull and run Redis
docker run -d -p 6379:6379 --name redis redis:latest

# Test
docker exec -it redis redis-cli ping  # Should return PONG
```

#### Option 3: Memurai (Native Windows)
Download from: https://www.memurai.com/get-memurai

### Environment Configuration

Add to `apps/api/.env` and `apps/worker/.env`:

```env
REDIS_URL=redis://localhost:6379
```

Or if using WSL2 with a specific IP:
```env
REDIS_URL=redis://172.x.x.x:6379
```

## Verifying the Fix

### 1. Test Authentication Fix
1. Sign out completely
2. Try to access the dashboard
3. You should be redirected to login
4. Sign in with User A
5. Create a monitor
6. Sign out and sign in with User B
7. User B should NOT see User A's monitors ✅

### 2. Test Monitoring System

After setting up Redis:

1. **Start all services**:
   ```bash
   # Terminal 1 - API
   cd apps/api
   pnpm run dev

   # Terminal 2 - Worker
   cd apps/worker
   pnpm run dev

   # Terminal 3 - Web
   cd apps/web
   pnpm run dev
   ```

2. **Create a monitor**:
   - Add a website (e.g., https://google.com)
   - Wait 1-2 minutes

3. **Check logs**:
   - API logs should show: `Queued X uptime jobs`
   - Worker logs should show: `[worker-XXXX] Redis connected`
   - After processing: Status should change from "Unknown" to "Up" or "Down"

## Troubleshooting

### Redis Connection Errors

If you see errors like:
```
Redis error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solutions**:
1. Make sure Redis is running: `redis-cli ping` (should return PONG)
2. Check REDIS_URL in .env files
3. If using WSL2, get the IP: `ip addr show eth0 | grep inet`
4. Update REDIS_URL to use the WSL2 IP

### Monitors Still Not Updating

1. **Check scheduler is running**:
   - API logs should show job queuing every minute
   
2. **Check worker is consuming**:
   - Worker logs should show job processing
   
3. **Check Redis has jobs**:
   ```bash
   redis-cli XLEN uptime:jobs
   ```

4. **Manually trigger a check**:
   - Restart the API server (scheduler runs on startup)

## Alternative: Disable Redis (Development Only)

If you want to test without Redis temporarily, you can modify the worker to check websites directly without Redis queuing. However, this is NOT recommended for production.

## Next Steps

1. ✅ Authentication fix is already applied (restart API if needed)
2. ⚠️ Install and configure Redis
3. ✅ Restart all services
4. ✅ Test monitor creation and status updates
