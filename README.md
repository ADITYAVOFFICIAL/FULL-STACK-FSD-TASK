# FULL-STACK-FSD-TASK - Student Team Members Management

This project is a full-stack web application for managing student team members. It includes a React frontend built with Vite, TypeScript, and Shadcn/ui, and a Node.js/Express backend with MongoDB for data persistence.

## Features

*   **Frontend:**
    *   View team information.
    *   Add new team members via a form with profile image uploads.
    *   Display a list of all team members.
    *   View detailed information for individual members.
    *   Responsive design.
    *   Dark mode support.
*   **Backend:**
    *   RESTful API for managing team members (Create, Read).
    *   MongoDB integration using Mongoose for data storage.
    *   Handles profile image uploads using Multer.
    *   Serves uploaded images statically.

## Tech Stack

**Frontend:** ([frontend/](frontend/))

*   Framework/Library: React.js
*   Build Tool: Vite
*   Language: TypeScript
*   Styling: Tailwind CSS
*   UI Components: Shadcn/ui
*   Routing: React Router DOM
*   State Management/Data Fetching: TanStack Query (React Query)
*   Form Handling: React Hook Form + Zod
*   HTTP Client: Axios
*   Package Manager: Bun

**Backend:** ([backend/](backend/))

*   Runtime Environment: Node.js
*   Framework: Express.js
*   Database: MongoDB
*   ODM: Mongoose
*   Middleware: CORS, Multer
*   Package Manager: npm

## Project Structure
```
.
├── backend/
│   ├── uploads/               # Stores uploaded profile images (created on run)
│   ├── package.json           # Backend dependencies and scripts
│   ├── server.js              # Express server setup and API routes
│   └── README.md              # Backend-specific documentation
├── frontend/
│   ├── public/                # Static assets
│   ├── src/                   # Frontend source code (components, pages, etc.)
│   ├── bun.lockb              # Bun lockfile
│   ├── index.html             # HTML entry point for Vite
│   ├── package.json           # Frontend dependencies and scripts
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.ts     # Tailwind CSS configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── README.md              # Frontend-specific documentation
├── .gitignore
└── README.md                  # This file (Project root README)

```


*(Note: `vercelbackend` and `frontend-vercel` directories are ignored in this overview as requested.)*

## Prerequisites

*   [Node.js](https://nodejs.org/) (includes npm) installed globally.
*   [Bun](https://bun.sh/docs/installation) installed globally.
*   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a MongoDB Atlas connection string.
    *   The backend currently uses a hardcoded Atlas connection string in [`backend/server.js`](backend/server.js). Update this if necessary or configure environment variables.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd FULL-STACK-FSD-TASK
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Ensure the MongoDB connection string in server.js is correct for your setup.
    # The 'uploads/' directory will be created automatically when the server runs.
    cd ..
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend
    bun install
    cd ..
    ```

## Running the Application

1.  **Run the Backend Server:**
    Open a terminal in the `backend` directory:
    ```bash
    # Using the development script with nodemon (recommended)
    npm run dev
    ```
    or
    ```bash
    # Directly using node
    npm start
    ```
    The backend server should start, typically on port 5069 (check console output).

2.  **Run the Frontend Development Server:**
    Open another terminal in the `frontend` directory:
    ```bash
    bun run dev
    ```
    The frontend development server (Vite) will start, typically on port 8080 (check [`frontend/vite.config.ts`](frontend/vite.config.ts) or console output).

3.  **Access the Application:**
    Open your web browser and navigate to the frontend URL (e.g., `http://localhost:8080`).

## Backend API Endpoints

The backend exposes the following main endpoints under the `/api` prefix (running on port 5069 by default):

*   `GET /api/members`: Retrieves a list of all team members.
*   `GET /api/members/:id`: Retrieves a single team member by their ID.
*   `POST /api/members`: Adds a new team member. Expects `multipart/form-data` including member details and an optional `profileImage` file.

*(Refer to [`backend/README.md`](backend/README.md) for more details on API endpoints and request/response formats.)*

## Building for Production (Frontend)

To create an optimized production build of the frontend:

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Run the build script:
    ```bash
    bun run build
    ```
3.  The production-ready static assets will be generated in the `frontend/dist/` directory. This directory can be deployed to any static file hosting service. You can preview the build locally using `bun run preview`.