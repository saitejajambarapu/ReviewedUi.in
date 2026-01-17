# -----------------------------
# Stage 1: Build React App
# -----------------------------
FROM node:20-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy only package files first (better caching)
# If source code changes but dependencies don't, npm install will be reused from cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build production output (creates /app/build)
RUN npm run build


# -----------------------------
# Stage 2: Serve with Nginx
# -----------------------------
FROM nginx:alpine

# Copy the build output from stage 1 into nginx static folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]












# # Build stage
# FROM node:20-alpine AS build

# # Set working directory
# WORKDIR /app 

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build


# # Runtime stage
# FROM nginx:alpine

# # Copy build output to nginx html folder
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose nginx default port
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
