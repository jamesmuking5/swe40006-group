# SWE40006 Car Shop Web App - DevOps & CI/CD

Project Brief: Demonstrating DevOps – Building a Seamless CI/CD Pipeline with Online Shopping Web App for Cars. SWE40006 Software Deployment and Evolution. Group: JZW.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions"/>
  <img src="https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Microsoft Azure"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"/>
</p>

This document outlines the DevOps practices, CI/CD pipeline, and operational aspects of the Car Shop Web App.

## Table of Contents

- [SWE40006 Car Shop Web App - DevOps \& CI/CD](#swe40006-car-shop-web-app---devops--cicd)
  - [Table of Contents](#table-of-contents)
  - [1. Project Overview](#1-project-overview)
  - [2. Repository Structure](#2-repository-structure)
  - [3. DevOps Pipeline (CI/CD)](#3-devops-pipeline-cicd)
    - [GitHub Actions Workflows](#github-actions-workflows)
    - [Dockerization](#dockerization)
    - [Azure Integration](#azure-integration)
  - [4. Environment Configuration](#4-environment-configuration)
  - [5. Local Development](#5-local-development)
    - [Using Docker Compose](#using-docker-compose)
    - [Manual Setup](#manual-setup)
  - [6. Testing Strategy](#6-testing-strategy)
    - [Backend Unit Tests](#backend-unit-tests)
    - [Pre-Staging Integration Tests](#pre-staging-integration-tests)
  - [7. Deployment Strategy](#7-deployment-strategy)
    - [Staging Environment](#staging-environment)
    - [Production Environment](#production-environment)
  - [8. Key Technologies](#8-key-technologies)
  - [9. Authors](#9-authors)
  - [10. Credits and Appreciation](#10-credits-and-appreciation)
  - [11. License](#11-license)

## 1. Project Overview

The Car Shop Web App is a MERN (MongoDB, Express.js, React, Node.js) stack application designed to showcase an online car shopping experience. The project emphasizes a robust DevOps lifecycle, including automated testing, containerization, and a CI/CD pipeline for deployments to Microsoft Azure.

> [!TIP]
> This project serves as a practical demonstration of implementing DevOps principles to build, test, and deploy a web application efficiently and reliably.

## 2. Repository Structure

The repository is organized as follows:

```
.
├── .github/                                    # GitHub Actions workflows
│   └── workflows/
│       ├── build-deploy-acr-webapp-oidc.yml    # Main CI/CD pipeline for Azure
│       ├── docker-compose-pre-staging-test.yml # Docker Compose tests
│       └── node.js.yml                         # Backend Node.js unit tests
├── backend/                                    # Node.js/Express.js backend application
│   ├── src/
│   ├── __tests__/
│   ├── package.json
│   └── .env.template                           # Backend environment variable template
├── frontend/                                   # React/Vite frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.development                        # Frontend development environment variables
├── .dockerignore                               # Specifies files to ignore for Docker build
├── .gitignore                                  # Specifies intentionally untracked files
├── Dockerfile                                  # Defines the multi-stage Docker build
├── docker-compose.yaml                         # Docker Compose for local dev & testing
├── LICENSE
└── README.md                                   # This file
```

> [!NOTE]
> This clear and organized repository structure promotes modularity and makes it easier to navigate and manage the different components of the application.

## 3. DevOps Pipeline (CI/CD)

The CI/CD pipeline is orchestrated using GitHub Actions, leveraging Docker for containerization and deploying to Azure Web Apps.

> [!NOTE]
> The CI/CD pipeline automates the build, test, and deployment processes, enabling rapid and reliable software delivery.

### GitHub Actions Workflows

- **[`build-deploy-acr-webapp-oidc.yml`](.github/workflows/build-deploy-acr-webapp-oidc.yml)**: This is the primary workflow for building and deploying the application.

  - **Triggers**:
    - Push to `main` or `chore/ci-setup` branches (for staging deployment).
    - Publishing a new GitHub Release (for production deployment).
    - Manual trigger via `workflow_dispatch`.
  - **Key Stages**:
    1.  **Permissions**:
        > [!NOTE]
        > Requests `id-token: write` for OIDC authentication with Azure and `contents: read` to checkout code.
    2.  **Build and Push to ACR (`build-and-push-to-acr` job)**:
        - Sets image tags based on Git SHA (for pushes) or release tag name (for releases).
        - Sets `BUILD_ENV` (to `staging` or `production`) based on the event type.
        - Logs into Azure using OIDC (`azure/login@v2`) with secrets for Client ID, Tenant ID, and Subscription ID.
        - Logs into Azure Container Registry (ACR) using `az acr login`.
        - Sets up Docker Buildx.
        - Uses `docker/metadata-action` to generate image tags and labels.
        - Builds the Docker image using the [Dockerfile](Dockerfile) and pushes it to ACR. The `APP_ENV` build argument is passed to Docker, derived from `BUILD_ENV`.
        - Logs out of Azure.
    3.  **Deploy to Staging (`deploy-to-staging` job)**:
        - Depends on the `build-and-push-to-acr` job.
        - Runs if the event is a push to `main` or `chore/ci-setup`.
        - Defines a GitHub `staging` environment with a dynamic URL.
        - Logs into Azure using OIDC.
        - Deploys the image from ACR to the Azure Web App for Staging (`azure/webapps-deploy@v2`) using secrets for the web app name.
        - Logs out of Azure.
    4.  **Deploy to Production (`deploy-to-production` job)**:
        - Depends on the `build-and-push-to-acr` job.
        - Runs if the event is a published GitHub Release.
        - Defines a GitHub `production` environment with a dynamic URL.
        - Logs into Azure using OIDC.
        - Deploys the image from ACR to the Azure Web App for Production (`azure/webapps-deploy@v2`) using secrets for the web app name.
        - Logs out of Azure.

- **[`docker-compose-pre-staging-test.yml`](.github/workflows/docker-compose-pre-staging-test.yml)**:

  > [!NOTE]
  > This workflow performs integration and health checks using Docker Compose before any deployment to a live staging environment. This acts as an early feedback mechanism.

  - **Triggers**: Push to `main` or manual `workflow_dispatch`.
  - **Key Stages**:
    1.  Checks out the code.
    2.  Sets up Docker Buildx.
    3.  Uses `docker compose` to:
        - Start the `mongodb` service.
        - Build and start the `app` service.
        - Waits for services to be ready.
        - Performs a basic health check using `curl` on `http://localhost:8000/`.
        - Runs a Trivy security scan on the built image (non-blocking).
        - Shuts down the services.

- **[`node.js.yml`](.github/workflows/node.js.yml)**: This workflow runs backend unit tests.
  - **Triggers**: Push or Pull Request to the `main` branch.
  - **Key Stages**:
    1.  Checks out the code.
    2.  Sets up multiple Node.js versions (18.x, 20.x, 22.x) for testing.
        > [!TIP]
        > Testing against multiple Node.js versions helps ensure compatibility and catch version-specific issues early.
    3.  Installs backend dependencies (`npm ci` in the `backend` directory).
    4.  Runs backend unit tests (`npm test` in the `backend` directory).

### Dockerization

The application is containerized using Docker.

> [!NOTE]
> Docker containerization ensures that the application runs consistently across different environments, from local development to production, by packaging the application and its dependencies together.

- **[Dockerfile](Dockerfile)**:

  > [!TIP]
  > A multi-stage Dockerfile is used for an optimized and secure image. This reduces the final image size by excluding build-time dependencies and artifacts.

  1.  **`base` stage**: Uses `node:23-alpine` and installs common build dependencies (`python3`, `make`, `g++`).
  2.  **`frontend-build` stage**:
      - Copies frontend source code and `package.json`.
      - Installs frontend dependencies (`npm ci`).
      - Accepts an `APP_ENV` build argument (passed from the CI/CD workflow).
      - Creates a `frontend/.env.production` file, setting `VITE_APP_ENVIRONMENT` based on `APP_ENV`. This allows the frontend to display if it's running in "staging" or "production".
      - Builds the static frontend assets (`npm run build`).
  3.  **`backend-build` stage**:
      - Copies backend source code and `package.json`.
      - Installs backend production dependencies (`npm ci --only=production`).
  4.  **`production` stage (final image)**:
      - Uses `node:23-alpine`.
      - Installs `pm2` globally for process management.
      - Copies built backend application from the `backend-build` stage.
      - Copies built frontend static assets from the `frontend-build` stage into the backend's `/app/public` directory, allowing Express to serve them.
      - > [!IMPORTANT]
        > Creates a non-root user (`appuser`) for security. Running applications as a non-root user is a crucial security best practice.
      - Sets the working directory to `/app` and switches to `appuser`.
      - Exposes port 8000.
      - Uses `pm2-runtime` to start the backend application (`src/index.js`).

- **[docker-compose.yaml](docker-compose.yaml)**: Used for local development and pre-staging tests.

  > [!NOTE] > `docker-compose.yaml` simplifies the setup of multi-container applications, making it easy to run the app and its dependencies (like MongoDB) with a single command.

  - Defines two main services:
    - `mongodb`: Uses the official `mongo:latest` image, maps port 27017, and uses a volume for data persistence.
    - `app`: Builds from the local [Dockerfile](Dockerfile), maps port 8000, sets environment variables for MongoDB connection, and depends on the `mongodb` service.
  - Includes a `security-scan` service using `aquasec/trivy` for vulnerability scanning (used in the [`docker-compose-pre-staging-test.yml`](.github/workflows/docker-compose-pre-staging-test.yml) workflow).

- **[.dockerignore](.dockerignore)**: Specifies files and directories to exclude from the Docker build context.
  > [!TIP]
  > Using a `.dockerignore` file optimizes build times and reduces the size of the Docker image by preventing unnecessary files (like `node_modules`, `.git`) from being sent to the Docker daemon.

### Azure Integration

Microsoft Azure provides a scalable and robust cloud platform for hosting the application and its supporting services.

- **Azure Container Registry (ACR)**: Docker images built by the CI pipeline are pushed to ACR. Secrets `ACR_LOGIN_SERVER`, `ACR_NAME`, and `ACR_IMAGE_NAME` are used.
  > [!NOTE]
  > ACR is a private Docker registry for storing and managing container images.
- **Azure Web App**: The application is deployed to Azure Web App for Containers.
  - Separate instances for "staging" (`secrets.AZURE_WEBAPP_NAME_STAGING`) and "production" (`secrets.AZURE_WEBAPP_NAME_PRODUCTION`).
    > [!NOTE]
    > Azure Web App for Containers simplifies deploying and scaling containerized applications.
- **OpenID Connect (OIDC)**:
  > [!NOTE]
  > Used for secure, passwordless authentication between GitHub Actions and Azure. This avoids storing long-lived Azure credentials as GitHub secrets. The workflow requests an ID token from GitHub and exchanges it for an Azure access token.

## 4. Environment Configuration

> [!IMPORTANT]
> Securely manage sensitive information like API keys and database credentials. Do not commit `.env` files containing actual secrets to version control. Use templates (e.g., [backend/.env.template](backend/.env.template)) and environment variables provided by the hosting platform (like Azure Web App settings).

- **Backend**:
  - Environment variables are managed via a `.env` file in the `backend` directory (gitignored).
  - A template is provided in [backend/.env.template](backend/.env.template).
  - Key variables include `PORT`, `HOST`, `MONGODB_URI`, `MONGODB_NAME`, and `ENV`.
  - In Docker, these are typically set at runtime (e.g., in `docker-compose.yaml` or Azure Web App configuration).
- **Frontend**:
  - Uses Vite for environment variables, prefixed with `VITE_`.
  - [frontend/.env.development](frontend/.env.development) is used for local development (e.g., `VITE_API_BASE_URL` for the backend).
  - > [!IMPORTANT]
    > For staging/production builds within Docker, `VITE_APP_ENVIRONMENT` is dynamically set in `frontend/.env.production` during the Docker build process. This value comes from the `APP_ENV` build argument, which is sourced from the `BUILD_ENV` variable in the GitHub Actions workflow. This allows the footer in [frontend/src/App.jsx](frontend/src/App.jsx) to display the current environment.
  - `VITE_API_BASE_URL` is set to an empty string in `frontend/.env.production` (created during Docker build) because the backend serves the frontend assets, so API calls can use relative paths.
    > [!TIP]
    > Setting `VITE_API_BASE_URL` to an empty string for production/staging builds allows the frontend to make API calls to the same origin, simplifying deployment as the backend serves the frontend.

## 5. Local Development

### Using Docker Compose

> [!TIP]
> The recommended way to run the application locally is with Docker Compose. It mirrors the containerized setup and simplifies dependency management.

1.  Ensure Docker and Docker Compose are installed.
    > [!CAUTION]
    > Docker Desktop (or equivalent Docker engine and Docker Compose CLI) must be installed and running on your local machine.
2.  Create a `backend/.env` file from [backend/.env.template](backend/.env.template) and configure as needed (defaults should work with Docker Compose).
3.  From the project root, run:
    ```bash
    docker compose up --build
    ```
    This will build the `app` image (if not already built or if changes are detected) and start both the `app` and `mongodb` services.
4.  The frontend will be accessible at `http://localhost:8000` (served by the backend).
5.  To stop the services: `docker compose down`.

### Manual Setup

> [!NOTE]
> Manual setup requires managing dependencies and services (like MongoDB) separately. This can be more complex and less consistent than using Docker Compose.

- **Backend**:
  1.  Navigate to the `backend` directory.
  2.  Create a `.env` file from the template.
  3.  Install dependencies: `npm install`
  4.  Run the development server: `npm run dev` (uses Nodemon).
  5.  Requires a separate MongoDB instance running and configured in `.env`.
- **Frontend**:
  1.  Navigate to the `frontend` directory.
  2.  Ensure [frontend/.env.development](frontend/.env.development) points to your local backend (default `http://localhost:5000` if backend runs on port 5000).
  3.  Install dependencies: `npm install`
  4.  Run the Vite development server: `npm run dev` (typically on `http://localhost:3000`).

## 6. Testing Strategy

> [!NOTE]
> A comprehensive testing strategy is crucial for ensuring code quality, catching bugs early, and maintaining application stability.

### Backend Unit Tests

- Located in [backend/**tests**](backend/__tests__).
- Uses Jest as the testing framework.
  > [!TIP]
  > Jest is a popular JavaScript testing framework that provides an integrated experience for writing and running tests.
- Includes tests for:
  - MongoDB connection and default data seeding ([mongodb.test.js](backend/__tests__/mongodb.test.js)).
  - API routes/endpoints ([carinfo.test.js](backend/__tests__/carinfo.test.js)).
- Uses `mongodb-memory-server` for isolated database testing.
  > [!NOTE] > `mongodb-memory-server` spins up an in-memory MongoDB instance for tests, ensuring that tests are fast, isolated, and don't interfere with a real database.
- Run automatically by the [Node.js CI workflow](.github/workflows/node.js.yml) on pushes/PRs to `main`.
- Can be run locally from the `backend` directory: `npm test`.

### Pre-Staging Integration Tests

- The [Docker Compose CI workflow](.github/workflows/docker-compose-pre-staging-test.yml) performs basic integration tests.
- It builds the application with `docker compose`, starts the services, and performs a health check by calling the root API endpoint.
- It also includes a Trivy security scan of the built Docker image.
  > [!TIP]
  > Trivy is a simple and comprehensive vulnerability scanner for containers and other artifacts.

## 7. Deployment Strategy

Deployments are automated via the [build-deploy-acr-webapp-oidc.yml](.github/workflows/build-deploy-acr-webapp-oidc.yml) workflow.

> [!NOTE]
> Using separate staging and production environments allows for thorough testing of new changes in a production-like setting before they are released to end-users, minimizing risks.

### Staging Environment

- **Trigger**: Push to `main` or `chore/ci-setup` branches.
- **Process**: The workflow builds the Docker image, tags it with the Git SHA, pushes it to ACR, and then deploys it to the Azure Web App designated for staging.
- > [!NOTE] > **Purpose**: For testing new features and changes in a production-like environment before releasing to actual users.
- The frontend will display "(Staging)" in the footer.

### Production Environment

- > [!IMPORTANT] > **Trigger**: Publishing a new GitHub Release (tagging a commit). This provides a controlled way to promote tested code to production.
- **Process**: The workflow builds the Docker image, tags it with the release tag, pushes it to ACR, and then deploys it to the Azure Web App designated for production.
- **Purpose**: For releasing stable, tested versions of the application to end-users.
- The frontend will display "(Production)" in the footer.

## 8. Key Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Microsoft Azure (Azure Web Apps, Azure Container Registry)
- **Process Management**: PM2
- **Testing**: Jest, Supertest
- **Security Scanning**: Trivy
-

## 9. Authors

- [James M.](https://github.com/jamesmuking5), 2025

## 10. Credits and Appreciation

- Special thanks to SWE40006 Software and Deployment lecturer [Jason T.C.](jtchew@swinburne.edu.my) for his guidance and support throughout the project.

## 11. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
