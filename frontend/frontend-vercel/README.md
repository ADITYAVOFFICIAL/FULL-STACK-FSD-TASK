# Frontend - Student Team Members Management Application

This directory contains the frontend code for the Student Team Members Management Application, built with React, Vite, TypeScript, and Shadcn/ui.

## Project Description

The frontend provides the user interface for managing student team members. Key features include:

-   Viewing team information.
-   Adding new team members with profile images via a form.
-   Displaying a list of all team members.
-   Viewing detailed information for individual members.
-   Responsive design adapting to different screen sizes.
-   Dark mode support.

## Technologies Used

-   **Framework/Library**: [React.js](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **State Management/Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Linting**: [ESLint](https://eslint.org/)
-   **Package Manager**: [Bun](https://bun.sh/) (or npm/yarn)

## Project Structure

```
frontend/
├── public/              # Static assets (favicon, images, etc.)
├── src/                 # Source code
│   ├── components/      # Reusable UI components (Shadcn UI & custom)
│   │   ├── ui/          # Shadcn UI generated components
│   │   └── ...          # Custom components (e.g., Footer, ErrorDisplay)
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and Shadcn helpers (e.g., cn)
│   ├── pages/           # Page-level components corresponding to routes
│   ├── utils/           # General utility functions
│   ├── App.css          # Minimal global styles (mostly handled by Tailwind/Shadcn)
│   ├── App.tsx          # Main application component with routing setup
│   ├── index.css        # Tailwind directives and global CSS variables/styles
│   ├── main.tsx         # Entry point of the React application
│   └── vite-env.d.ts    # Vite environment type definitions
├── .gitignore           # Git ignore rules
├── bun.lockb            # Bun lockfile
├── components.json      # Shadcn/ui configuration
├── eslint.config.js     # ESLint configuration
├── index.html           # Main HTML entry point for Vite
├── package.json         # Project metadata and dependencies
├── postcss.config.js    # PostCSS configuration (for Tailwind)
├── README.md            # This file
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.app.json    # TypeScript configuration for the application code
├── tsconfig.json        # Base TypeScript configuration
├── tsconfig.node.json   # TypeScript configuration for Node.js scripts (like vite.config.ts)
└── vite.config.ts       # Vite configuration file
```

## Prerequisites

-   [Bun](https://bun.sh/docs/installation) installed globally.
-   A running instance of the backend server (see main project README).

## Setup and Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies using Bun:**
    ```bash
    bun install
    ```
    This command reads the [`package.json`](frontend/package.json) file and installs all the necessary dependencies listed, creating a `bun.lockb` file to ensure consistent installs.

## Available Scripts

In the `frontend` directory, you can run the following scripts using Bun:

-   **`bun run dev`**: Starts the Vite development server. The application will typically be available at `http://localhost:5173` (Vite's default, check terminal output). The server features Hot Module Replacement (HMR) for a fast development experience.

-   **`bun run build`**: Compiles and bundles the application for production. The output is placed in the `dist/` directory. This script uses Vite's production build process, optimizing assets for performance.

-   **`bun run build:dev`**: Compiles the application using Vite's development mode settings, useful for debugging build issues. Output is also in `dist/`.

-   **`bun run lint`**: Runs ESLint to analyze the code for potential errors and style issues based on the configuration in [`eslint.config.js`](frontend/eslint.config.js).

-   **`bun run preview`**: Starts a local static web server to preview the production build located in the `dist/` directory. This is useful for testing the production build locally before deployment.

## Running the Frontend

1.  **Ensure the backend server is running.** (Refer to the main project README or `backend/README.md` if available).
2.  **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```
3.  **Start the development server:**
    ```bash
    bun run dev
    ```
4.  Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Building for Production

1.  **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```
2.  **Run the build script:**
    ```bash
    bun run build
    ```
3.  The optimized production assets will be generated in the `frontend/dist/` directory. This `dist` folder can then be deployed to a static file server or hosting platform.