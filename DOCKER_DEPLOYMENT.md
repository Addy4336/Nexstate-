# Docker Deployment Guide

## 🐳 Docker Images Built

Both applications have been containerized and are ready to deploy:

- **nexstate-frontend** - Public-facing website (Port: 3000)
- **nexstate-cms** - Admin CMS panel (Port: 3001)

## 📦 Image Details

```bash
nexstate-frontend:latest   ~517MB
nexstate-cms:latest        ~572MB
```

## 🚀 Quick Start

### Run Services Individually

**Frontend:**
```bash
docker run -d \
  --name nexstate-frontend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  nexstate-frontend:latest
```

**CMS (with environment variables from .env file):**
```bash
docker run -d \
  --name nexstate-cms \
  -p 3001:3001 \
  --env-file ./nexstate-cms/.env \
  -e NODE_ENV=production \
  nexstate-cms:latest
```

**Access applications:**
- Frontend: http://localhost:3000
- CMS: http://localhost:3001

### Stop Services

```bash
# Stop frontend
docker stop nexstate-frontend
docker rm nexstate-frontend

# Stop CMS
docker stop nexstate-cms
docker rm nexstate-cms
```

## 🔧 Configuration

### Environment Variables

Make sure you have `.env` file in the `nexstate-cms` directory with required configurations:
- Database connection strings
- API keys
- Authentication secrets
- etc.

### Ports

- **3000** - Frontend application
- **3001** - CMS application

## 📊 Monitoring

### Check Container Status
```bash
docker ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f nexstate-frontend
docker logs -f nexstate-cms
```

### Health Checks
```bash
# Frontend
curl http://localhost:3000/

# CMS
curl http://localhost:3001/
```

## 🔄 Rebuilding Images

If you make changes to the code:

```bash
# Rebuild specific service
docker-compose build frontend
docker-compose build cms

# Rebuild all
docker-compose build

# Or build manually
docker build -t nexstate-frontend:latest ./nexstate-frontend
docker build -t nexstate-cms:latest ./nexstate-cms
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi nexstate-frontend:latest
docker rmi nexstate-cms:latest

# Clean up all unused Docker resources
docker system prune -a
```

## 🌐 Production Deployment

For production deployment, consider:

1. **Use a reverse proxy** (nginx, Traefik) for SSL/TLS termination
2. **Set up proper environment variables** for production
3. **Configure logging and monitoring** (e.g., ELK stack, Prometheus)
4. **Use container orchestration** (Kubernetes, Docker Swarm)
5. **Implement CI/CD pipelines** for automated builds
6. **Configure backup strategies** for data persistence

## 📝 Docker Compose Commands Reference

```bash
# Start services in background
docker-compose up -d

# Start and rebuild
docker-compose up -d --build

# View running services
docker-compose ps

# Scale services
docker-compose up -d --scale frontend=3

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Remove containers
docker-compose rm
```

## 🐛 Troubleshooting

### Port Conflicts
If ports 3000 or 3001 are already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Map to different host port
```

### Container Won't Start
```bash
# Check logs
docker logs nexstate-frontend

# Inspect container
docker inspect nexstate-frontend

# Check environment variables
docker exec nexstate-frontend env
```

### Out of Memory
Increase Docker memory limits in Docker Desktop settings or use:
```bash
docker run --memory="2g" --memory-swap="2g" ...
```

## 📋 Multi-Stage Build Architecture

Both Dockerfiles use multi-stage builds for optimization:

1. **deps** - Install dependencies
2. **builder** - Build the application
3. **runner** - Production runtime (minimal, ~517MB)

This ensures:
- ✅ Smaller image sizes
- ✅ Better security (no build tools in production)
- ✅ Faster deployment times
- ✅ Layer caching for faster rebuilds

## 🔐 Security Best Practices

✅ Run as non-root user (nextjs:1001)
✅ Minimal base image (bun:1-slim)
✅ No sensitive data in images
✅ Environment variables for secrets
✅ Health checks enabled
✅ .dockerignore configured

---

**Built with:** Bun, Next.js 16, Docker
**Last Updated:** January 27, 2026
