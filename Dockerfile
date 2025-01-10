FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set the working directory
WORKDIR /app

# Copy package manager configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Enable corepack and install dependencies
RUN corepack enable && \
    pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder

# Copy the application files
COPY . .

# Copy installed dependencies from base stage
COPY --from=base /app/node_modules /app/

# First deploy with all dependencies for building
RUN pnpm deploy --filter=server /prod 

WORKDIR /prod

RUN pnpm build

# After build, deploy again with only production dependencies
RUN pnpm deploy --filter=server --prod /prod-final

# Final stage
FROM node:20-alpine AS final

ENV NODE_ENV=production
WORKDIR /app

# Copy only the necessary files from the production deploy
COPY --from=builder /prod-final/package.json ./
COPY --from=builder /prod/dist ./dist
COPY --from=builder /prod-final/node_modules ./node_modules

EXPOSE 3434

CMD ["node", "dist/src/index.js"]