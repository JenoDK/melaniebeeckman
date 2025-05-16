# Melanie Beeckman Portfolio

This repository contains the frontend (Astro) and backend (Strapi CMS) configurations for the [Your Project Name] website. The site is designed to be a performant, statically-generated frontend with a headless CMS for easy content management.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Strapi (CMS Backend)](#strapi-cms-backend)
  - [Astro (Static Frontend)](#astro-static-frontend)
- [Production Deployment Architecture](#production-deployment-architecture)
  - [Server Environment](#server-environment)
  - [Docker Setup](#docker-setup)
  - [Nginx Configuration](#nginx-configuration)
  - [Automated Rebuilds (Webhooks)](#automated-rebuilds-webhooks)
- [Deployment Steps Overview](#deployment-steps-overview)
- [Important Configuration Notes](#important-configuration-notes)
- [Contributing (Optional)](#contributing-optional)
- [License (Optional)](#license-optional)

## Project Overview

This project consists of two main parts:

1.  **Strapi CMS (`melaniebeeckman-strapi`):** A headless CMS used to manage all website content (pages, services, articles, etc.). It provides a user-friendly admin interface for the client and exposes content via a REST API.
2.  **Astro Frontend (`melaniebeeckman-astro`):** A static site generator that fetches content from the Strapi API during its build process. It generates highly optimized static HTML, CSS, and JavaScript files for fast loading and good SEO.

The live website serves these static files, and content updates in Strapi trigger an automatic rebuild and deployment of the Astro site.

## Technologies Used

*   **Backend (CMS):**
    *   Strapi (vX.X.X) - Headless CMS
    *   Node.js (vX.X.X for Strapi)
    *   PostgreSQL (vX.X) - Production Database for Strapi (or SQLite if used)
*   **Frontend:**
    *   Astro (vX.X.X) - Static Site Generator
    *   Node.js (vX.X.X for Astro build - ideally managed with NVM)
    *   [Any frontend frameworks used with Astro, e.g., React, Vue, Svelte, Tailwind CSS]
*   **Deployment & Hosting:**
    *   Docker & Docker Compose - For containerizing Strapi and its database.
    *   Nginx - Web server and reverse proxy.
    *   PM2 (or similar) - Process manager for any helper scripts (e.g., webhook listener).
    *   Ubuntu Server LTS (or similar Linux distribution)
*   **Version Control:** Git

## Local Development Setup

### Prerequisites

*   Node.js (LTS version recommended for both Strapi and Astro - use NVM to manage versions)
*   npm / yarn / pnpm
*   Docker & Docker Compose (if running Strapi locally via Docker, or for consistency with production)
*   Git

### Strapi (CMS Backend)

Located in the `melaniebeeckman-strapi` directory.

1.  **Navigate to the Strapi directory:**
    ```bash
    cd melaniebeeckman-strapi
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install / pnpm install
    ```
3.  **Configure local environment variables:**
    Create a `.env` file in the Strapi project root based on `.env.example` (if provided). Key variables include:
    *   `HOST`, `PORT`
    *   `DATABASE_CLIENT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` (for local database, often SQLite for simplicity)
    *   `ADMIN_JWT_SECRET`, `APP_KEYS`, `API_TOKEN_SALT`, `JWT_SECRET`
    *   `PUBLIC_URL` (e.g., `http://localhost:1337` or `http://localhost:1337/strapi` if developing with a subpath)
4.  **Run Strapi in development mode:**
    ```bash
    npm run develop
    # or yarn develop / pnpm develop
    ```
5.  Access the Strapi admin panel (usually `http://localhost:1337/admin`) to create the first admin user, define content types, and add content.
6.  Generate an API token (`Settings` -> `API Tokens`) with read permissions for Astro to use.

### Astro (Static Frontend)

Located in the `melaniebeeckman-astro` directory.

1.  **Navigate to the Astro directory:**
    ```bash
    cd melaniebeeckman-astro
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install / pnpm install
    ```
3.  **Configure local environment variables:**
    Create a `.env` file in the Astro project root. Key variables include:
    *   `PUBLIC_STRAPI_API_URL`: URL to your local Strapi API (e.g., `http://localhost:1337/api` or `http://localhost:1337/strapi/api`).
    *   `PUBLIC_STRAPI_API_TOKEN`: The read-only API token generated from your local Strapi instance.
4.  **Run Astro in development mode:**
    ```bash
    npm run dev
    # or yarn dev / pnpm dev
    ```
5.  Access the Astro development server (usually `http://localhost:4321`).

## Production Deployment Architecture

### Server Environment

The application is deployed on a Linux server (e.g., Ubuntu LTS on a bare metal server). Essential services like Nginx, Docker, and Node.js (via NVM) are installed.

### Docker Setup

*   **Strapi & Database:** Strapi and its PostgreSQL (or other) database are containerized using Docker and orchestrated with Docker Compose.
    *   A `docker-compose.yml` file defines the services, networks, volumes, and environment variables.
    *   Strapi's Docker image is built using a custom `Dockerfile` (e.g., `Dockerfile.prod`) which includes an `npm run build` step to compile the admin panel with production settings (like the correct `PUBLIC_URL`).
    *   Persistent data for the database and Strapi uploads are managed using Docker volumes.
    *   The Docker Compose stack is managed as a `systemd` service for auto-start and robustness.
*   **Environment Variables:** Production secrets and configurations for Dockerized services are managed via an `.env` file used by Docker Compose. This includes database credentials, Strapi secrets, and `PUBLIC_URL` for Strapi.

### Nginx Configuration

Nginx acts as a web server and reverse proxy:
1.  **Serves Static Astro Files:** Serves the pre-built static HTML, CSS, and JS files generated by Astro from a designated web root directory (e.g., `/var/www/yourdomain.com/html`).
2.  **Reverse Proxies Strapi:**
    *   Requests to a specific subpath (e.g., `/strapi/`) are proxied to the Strapi Docker container running on `127.0.0.1:1337`.
    *   This makes the Strapi admin panel accessible (e.g., `https://yourdomain.com/strapi/admin/`) and the API available (e.g., `https://yourdomain.com/strapi/api/`).
    *   Nginx handles SSL/TLS termination for the public domain.
3.  **Proxies Webhook Listener:** Requests to a dedicated webhook endpoint (e.g., `/webhooks/rebuild-astro-prod`) are proxied to a lightweight Node.js listener application. IP restrictions are configured in Nginx to enhance webhook security.

### Automated Rebuilds (Webhooks)

1.  **Strapi Webhook Configuration:** When content is published or updated in Strapi, a webhook is configured to send a POST request to a specific endpoint on the server. This webhook includes a shared secret for verification.
2.  **Webhook Listener:** A small Node.js (Express) application runs on the server (managed by PM2), listening for these webhook requests.
    *   It verifies the shared secret from the webhook request.
    *   Upon successful verification, it executes a deployment script.
3.  **Deployment Script (`deploy-astro.sh` or similar):** This shell script automates the Astro site rebuild and deployment:
    *   Ensures the correct Node.js version is active (using NVM).
    *   Navigates to the Astro project directory.
    *   Sets production environment variables for the Astro build (Strapi API URL and Token).
    *   Installs/updates Astro dependencies.
    *   Runs the Astro build command (`npm run build`).
    *   Copies the newly built static files from Astro's `dist/` directory to Nginx's web root for the live site.
    *   Sets appropriate file permissions for Nginx.

## Deployment Steps Overview

(This is a high-level overview. Specific commands and paths are server-dependent.)

1.  **Server Setup:**
    *   Provision Linux server.
    *   Install Nginx, Docker, Docker Compose, Node.js (via NVM), PM2, Git.
    *   Configure firewall.
2.  **Clone Repositories:** Clone this repository (or separate frontend/backend repos) to the server.
3.  **Configure Strapi & Database (Docker):**
    *   Create production `.env` file with all necessary secrets and configurations (database credentials, Strapi keys, `PUBLIC_URL` for Strapi, initial admin user credentials).
    *   Modify `docker-compose.yml` if needed (e.g., to pass build args like `PUBLIC_URL` to Strapi's Docker build).
    *   Build the Strapi Docker image: `docker-compose build strapi`.
    *   Start the Docker Compose stack: `docker-compose up -d`.
    *   Set up the Docker Compose stack as a `systemd` service for auto-start.
4.  **Configure Nginx:**
    *   Create an Nginx site configuration file to:
        *   Serve static files from Astro's future build output directory.
        *   Reverse proxy `/strapi/` to the Strapi container.
        *   Reverse proxy the webhook endpoint to the listener application.
    *   Set up SSL/TLS using Certbot.
5.  **Set up Webhook Listener:**
    *   Deploy the Node.js listener application.
    *   Configure its environment (port, path to deploy script, webhook secret).
    *   Run it using PM2.
6.  **Configure Strapi Admin & Webhook:**
    *   Access the production Strapi admin panel. If not pre-seeded, create the initial admin user (ensure this step is secured).
    *   Configure API Tokens for Astro (read-only for production).
    *   Configure the webhook in Strapi to point to your Nginx-proxied listener endpoint, including the shared secret.
7.  **Deploy Astro Frontend:**
    *   Run the `build-and-deploy-astro.sh` script (or its equivalent manual steps) to:
        *   Build the Astro site (fetching data from the live Strapi API using the production token).
        *   Copy built files to the Nginx web root.
        *   Set permissions.
8.  **Test:** Test the live site, Strapi admin access, and the webhook-triggered rebuild process.

## Important Configuration Notes

*   **Environment Variables:** All sensitive information (API keys, database credentials, secrets, tokens) MUST be managed through environment variables and should NOT be hardcoded into the repository. Use `.env` files locally (added to `.gitignore`) and a secure method for managing them on the production server.
*   **Strapi `PUBLIC_URL`:** This is critical. It must be set correctly (e.g., `https://yourdomain.com/strapi`) in Strapi's configuration (via `.env` or `config/server.js`) and used during Strapi's *own build process* (inside its Dockerfile) so that the admin panel assets have correct paths.
*   **Astro Build Environment:** The Astro build process (`npm run build`) needs `PUBLIC_STRAPI_API_URL` and `PUBLIC_STRAPI_API_TOKEN` environment variables pointing to the *production* Strapi API and using the *production* API token.
*   **Webhook Security:** The webhook endpoint should be secured by verifying a shared secret. IP whitelisting in Nginx provides an additional layer.
*   **Permissions:** Ensure Nginx has read access to the Astro static files, and the user running the deployment script has necessary permissions.
*   **Backups:** Regularly back up your Strapi database and any uploaded files (Strapi uploads volume).

## License (Optional)

---