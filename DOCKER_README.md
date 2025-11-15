# Docker Development Setup

This project includes Docker configuration for development environment.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up
   ```

2. **Start services in background:**
   ```bash
   docker-compose up -d
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Rebuild containers:**
   ```bash
   docker-compose up --build
   ```

## Services

- **Backend**: Node.js/Express API running on http://localhost:3000
- **Database**: PostgreSQL running on localhost:5432

## Environment Variables

Copy the example environment files and customize as needed:

```bash
# Backend
cp backend/env.example backend/.env
```

## Database Setup

The PostgreSQL database will be automatically created. To run Prisma migrations:

```bash
# Access backend container
docker-compose exec backend sh

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

## Development Workflow

- Code changes are automatically reflected due to volume mounts
- Hot reload is enabled for backend
- Database data persists between container restarts

## Useful Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Execute commands in running container
docker-compose exec backend npm run prisma:studio

# Remove all containers and volumes
docker-compose down -v
```

