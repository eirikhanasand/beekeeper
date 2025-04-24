# Latest node base image
FROM node:20-alpine

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BROWSER_API
ARG NEXT_PUBLIC_CDN
ARG NEXT_PUBLIC_DEBUG

# Installs Python
RUN apk add --no-cache python3 make g++ varnish

# Container working directory
WORKDIR /app

# Starts varnish
COPY default.vcl /etc/varnish/default.vcl

# Copies entrypoint
COPY entrypoint.sh ./entrypoint.sh

# Copies package versions
COPY package*.json ./

# Installs dependencies
RUN npm install
RUN npm install fastify dotenv @fastify/cors pg @types/pg

# Copies source code
COPY . .

RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" >> /app/.env && \
    echo "NEXT_PUBLIC_BROWSER_API=${NEXT_PUBLIC_BROWSER_API}" >> /app/.env && \
    echo "NEXT_PUBLIC_CDN=${NEXT_PUBLIC_CDN}" >> /app/.env && \
    echo "NEXT_PUBLIC_DEBUG=${NEXT_PUBLIC_DEBUG}" >> /app/.env

# Builds the application
RUN npm run build

# Exposes port 3000
EXPOSE 3000

# Starts the application
CMD ["/bin/sh", "/app/entrypoint.sh"]
