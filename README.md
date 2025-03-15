## Redis Configuration

This application uses Redis for caching to improve performance. Redis is optional but recommended.

### Options for Redis:

1. **No Redis** (slower but simpler)
   - Set `USE_REDIS=false` in your .env file
   - No additional setup required

2. **Local Redis** (for development)
   - Install Redis locally or use Docker
   - Set `REDIS_URL=redis://localhost:6379` in your .env file

3. **Managed Redis** (recommended for production)
   - Sign up for [Upstash](https://upstash.com/) (free tier available)
   - Create a Redis database
   - Add the connection string to your .env file:
     `REDIS_URL=redis://username:password@global.upstash.io:6379`
