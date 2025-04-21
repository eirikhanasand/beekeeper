# Node image with Alpine Linux
FROM node:20-alpine

# Installs dependencies
RUN apk add --no-cache python3 make g++ curl postgresql-client 

# Install kubectl
RUN curl -LO https://dl.k8s.io/release/v1.24.0/bin/linux/amd64/kubectl && \
  chmod +x kubectl && \
  mv kubectl /usr/local/bin/

# Install doctl
RUN curl -sSL https://github.com/digitalocean/doctl/releases/download/v1.90.0/doctl-1.90.0-linux-amd64.tar.gz | \
  tar -xzv && \
  mv doctl /usr/local/bin/

# Sets working directory
WORKDIR /api

# Copies package.json and package-lock.json
COPY package*.json ./

# Installs dependencies
RUN npm install

# Copies the rest of the API source code
COPY . .

# Builds the project
RUN npm run build

# Adds script execution permissions
RUN chmod +x /api/init.sh /api/run_local_commands.sh /api/run_global_commands.sh /api/update.sh

# Runs commands every minute
RUN echo "* * * * * /bin/sh /api/update.sh" >> /etc/crontabs/root
RUN echo "* * * * * /bin/sh /api/run_local_commands.sh" >> /etc/crontabs/root
RUN echo "* * * * * /bin/sh /api/run_global_commands.sh" >> /etc/crontabs/root

# Exposes port 8080
EXPOSE 8080
