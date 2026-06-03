# ARCHITECTURE_DIAGRAMS.md

# Architecture Diagrams / Diagram Arsitektur

## 1. System Architecture

```mermaid
flowchart LR
  U[User Browser] --> FE[React Vite Frontend]
  FE --> AX[Axios Client]
  AX --> API[Express API]
  API --> MW[Middleware]
  MW --> CTL[Controllers]
  CTL --> SVC[Services]
  SVC --> REPO[Repositories]
  REPO --> DB[(MySQL)]
  API --> UP[Uploads Directory]
  API --> JWT[JWT Helpers]
```

## 2. Frontend Flow

```mermaid
flowchart TD
  Main[main.jsx] --> App[App.jsx Routes]
  App --> Layouts[Main/Admin/Seller Layouts]
  Layouts --> Pages[Pages]
  Pages --> Components[Reusable UI]
  Pages --> Stores[Zustand Stores]
  Stores --> API[Axios API]
  API --> Backend[Express Backend]
```

## 3. Backend Flow

```mermaid
flowchart TD
  Req[HTTP Request] --> Server[server.js]
  Server --> Route[Route Module]
  Route --> Auth[Auth/Role Middleware]
  Auth --> Sanitize[Sanitize Middleware]
  Sanitize --> Validator[Joi Validator]
  Validator --> Controller[Controller]
  Controller --> Service[Service]
  Service --> Repository[Repository]
  Repository --> MySQL[(MySQL)]
  Controller --> Response[successResponse/errorResponse]
```

## 4. Authentication Flow

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant API
  participant DB
  User->>Frontend: Login credentials
  Frontend->>API: POST /auth/login
  API->>DB: Find user and compare bcrypt hash
  API->>DB: Store refresh token hash
  API-->>Frontend: Access + refresh token
  Frontend->>API: Bearer access token request
  API-->>Frontend: Protected data
  Frontend->>API: POST /auth/refresh on 401
  API->>DB: Revoke old token and store new hash
  API-->>Frontend: New token pair
```

## 5. Database Flow

```mermaid
flowchart TD
  User[users] --> Role[roles]
  User --> Store[stores]
  Store --> Product[products]
  Product --> Images[product_images]
  Product --> Reviews[product_reviews]
  User --> Reviews
  User --> Cart[carts]
  Cart --> CartItems[cart_items]
  Product --> CartItems
  User --> Orders[orders]
  Store --> Orders
  Orders --> OrderItems[order_items]
  Product --> Wishlist[wishlists]
  User --> Wishlist
  User --> Tokens[refresh_tokens]
```

## 6. Deployment Flow

```mermaid
flowchart LR
  Dev[Developer] --> Git[Git Repository]
  Git --> CI[GitHub Actions]
  CI --> BuildFE[Build Frontend]
  CI --> CheckBE[Check Backend]
  BuildFE --> Server[VPS/Platform]
  CheckBE --> Server
  Server --> Nginx[Nginx Reverse Proxy]
  Nginx --> Frontend[Static Frontend]
  Nginx --> Backend[PM2 Backend]
  Backend --> MySQL[(MySQL)]
```

## 7. CI/CD Flow

```mermaid
flowchart TD
  Push[Push / Pull Request] --> Build[Build Workflow]
  Build --> Install[Install Dependencies]
  Install --> BackendCheck[Backend Syntax/Test]
  Install --> FrontendBuild[Frontend Build]
  BackendCheck --> Artifact[Artifacts]
  FrontendBuild --> Artifact
  Artifact --> DeployWorkflow[Deploy Workflow]
  DeployWorkflow --> SSH[SSH to VPS]
  SSH --> Pull[git pull]
  Pull --> InstallProd[Install production deps]
  InstallProd --> Migrate[Run migrations]
  Migrate --> BuildProd[Build frontend]
  BuildProd --> PM2[PM2 Reload]
  PM2 --> Nginx[Nginx Reload]
```
