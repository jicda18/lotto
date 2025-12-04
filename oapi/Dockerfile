# Etapa 1: Build
FROM node:24.11-alpine AS builder

WORKDIR /app

# Copiar solo archivos de dependencias primero para aprovechar cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Ejecutar el build (TypeScript, Webpack, etc.)
RUN yarn build

# Etapa 2: Producción
FROM node:24.11-alpine AS production

# Recibe argumentos para UID y GID
ARG APP_UID=1000
ARG APP_GID=1000

# Definir la variable de entorno
ENV PORT=3000
ENV TZ=America/Santo_Domingo

# Crear grupo y usuario sin privilegios con los IDs proporcionados
RUN addgroup -g ${APP_GID} lottogroup && adduser -u ${APP_UID} -G lottogroup -S lottouser

WORKDIR /app
# Copiar solo los archivos necesarios desde builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/prisma ./prisma
COPY entrypoint.sh /app/

RUN chmod +x /app/entrypoint.sh

# Crear el directorio de logs y dar permisos al usuario lottouser
RUN mkdir -p /app/logs && chown -R lottouser:lottogroup /app/logs

EXPOSE 3000

USER lottouser

ENTRYPOINT ["/app/entrypoint.sh"]
