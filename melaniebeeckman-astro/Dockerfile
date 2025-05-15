# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Environment variables for build time (if any are needed for generating static content)
# ARG STRAPI_API_URL
# ARG STRAPI_API_TOKEN
# ENV STRAPI_API_URL=${STRAPI_API_URL}
# ENV STRAPI_API_TOKEN=${STRAPI_API_TOKEN}
RUN npm run build

# Stage 2: This stage is not strictly necessary if Nginx serves from a host volume
# But it's good practice if you wanted a self-contained Nginx image with your site
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/melaniebeeckman
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]