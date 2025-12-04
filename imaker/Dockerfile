# Step 1: Build
FROM node:24.11 AS builder

WORKDIR /app

# Copy only dependency files first to take advantage of cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Run the build
RUN yarn build

# Step 2: Production
FROM node:24.11 AS production

# Receives arguments for UID and GID
ARG APP_UID=1000
ARG APP_GID=1000

# Define the environment variable
ENV TZ=America/Santo_Domingo

# Create unprivileged group and user with the provided IDs
RUN groupadd -g ${APP_GID} lottogroup && useradd -u ${APP_UID} -g lottogroup -s /bin/bash -m lottouser

WORKDIR /app
# Copy only the necessary files from the builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/temp ./temp
COPY --from=builder /app/dist ./dist
COPY entrypoint.sh /app/

RUN chmod +x /app/entrypoint.sh

# Create the logs directory and give permissions to the lottouser user
RUN mkdir -p /app/logs && chown -R lottouser:lottogroup /app/logs

USER lottouser

ENTRYPOINT ["/app/entrypoint.sh"]