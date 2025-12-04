# Stage 1: Building Stage
# =============================================
# Use a slim Node.js image for the build stage
FROM node:24.11-alpine AS builder

ENV VITE_OAPI_URL=http://oapi:3000

# Set the working directory inside the container
WORKDIR /app

# Copy dependency management files
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
# --frozen-lockfile ensures the exact versions from yarn.lock are used
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Run the Astro build script
RUN yarn build

# =============================================
FROM node:24.11-alpine AS production

# Receives arguments for UID and GID
ARG APP_UID=1000
ARG APP_GID=1000

# Definir la variable de entorno
ENV TZ=America/Santo_Domingo

# Create unprivileged group and user with the provided IDs
RUN addgroup -g ${APP_GID} lottogroup && adduser -u ${APP_UID} -G lottogroup -S lottouser

# Set the working directory
WORKDIR /app

# Copy only the necessary artifacts from the builder stage
# This includes the 'dist' folder (static assets and server), package.json, and yarn.lock
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY entrypoint.sh .

# Make entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Install ONLY production dependencies
RUN yarn install --production --frozen-lockfile

# Change ownership of the app directory to the unprivileged user
RUN chown -R lottouser:lottogroup /app

# Expose the port on which Astro will run the application
EXPOSE 4321

# Switch to the unprivileged user
USER lottouser

# Define the command to start the Astro server in production
ENTRYPOINT ["/app/entrypoint.sh"]
