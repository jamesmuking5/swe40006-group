# Use Node.js Alpine as the base image
FROM node:23-alpine AS base
LABEL maintainer="James Muking <102775371@students.swinburne.edu.my>"
LABEL description="A MERN stack that serves a Car Web App from a directory."

# Set working directory
WORKDIR /app

# Install dependencies required for builds
RUN apk add --no-cache python3 make g++

# First stage: Build frontend
FROM base AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Create .env.production with the correct API URL for production
# Since the backend will serve the frontend, use a relative URL
RUN echo "VITE_API_BASE_URL=" > .env.production
RUN echo "VITE_APP_ENVIRONMENT=${APP_ENV}" >> .env.production

# Build the frontend application
RUN npm run build

# Second stage: Setup backend
FROM base AS backend-build
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Third stage: Create the final image
FROM node:23-alpine AS production
WORKDIR /app

# Install global process manager (for production)
RUN npm install -g pm2

# Copy backend from the backend-build stage first for the static directory
COPY --from=backend-build /app/backend /app

# Copy built frontend from the frontend-build stage
COPY --from=frontend-build /app/frontend/dist /app/public

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Working directory for the application
WORKDIR /app

# Expose ports
EXPOSE 8000

# Start the application with PM2
CMD ["pm2-runtime", "start", "src/index.js"]