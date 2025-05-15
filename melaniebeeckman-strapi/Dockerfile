# Use a specific Node version compatible with your Strapi version
FROM node:18-alpine AS base
# Prevent accidental global installation of Strapi CLI
# RUN npm install -g strapi@latest # Not generally needed if using npx or local dep

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

COPY ./package.json ./
COPY ./package-lock.json ./

# Stage 1: Build Strapi admin panel
FROM base AS build
WORKDIR /opt/app
RUN yarn install --frozen-lockfile # or npm ci
COPY . .
RUN yarn build # or npm run build

# Stage 2: Production image
FROM base AS production
WORKDIR /opt/app

COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/package-lock.json ./
COPY --from=build /opt/app/.strapi ./.strapi
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src

# Install production dependencies
RUN npm ci --only=production

# Default Strapi port inside container
EXPOSE 1337

# For SQLite, ensure the data directory is writable by the node user
# RUN chown -R node:node /opt/app/.tmp
# USER node # Run as non-root user

CMD ["npm", "run", "start"]