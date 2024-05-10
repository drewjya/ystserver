# Base image
FROM node:18-alpine3.16 as builder

#Set Timezone
ENV TZ=Asia/Jakarta
RUN apk add -U tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (or pnpm-workspace.yaml if you use workspaces)
COPY package.json pnpm-lock.yaml ./

# Copy the .env file if needed during build
COPY .env ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm exec prisma generate && pnpm run build

# Stage 2: Production
FROM node:16-alpine

ENV TZ=Asia/Jakarta
RUN apk add -U tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm (if needed for any reason, else can be removed)
RUN npm install -g pnpm

# Only copy the necessary directories and files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Copy the .env file to production environment
COPY --from=builder /usr/src/app/.env ./

# Set the environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main.js"]
