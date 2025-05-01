# Backend - Student Team Members Management API

This directory contains the backend code for the Student Team Members Management Application. It's built with Node.js, Express, and MongoDB, providing a RESTful API for managing team member data and handling profile image uploads.

## Project Description

The backend server handles the core logic and data persistence for the application. Its main responsibilities include:

-   Connecting to a MongoDB database.
-   Defining the data schema for team members using Mongoose.
-   Providing API endpoints to perform CRUD (Create, Read, Update, Delete - though only Create and Read seem implemented) operations on team members.
-   Handling multipart/form-data requests for uploading profile images using Multer.
-   Serving uploaded profile images statically.
-   Enabling Cross-Origin Resource Sharing (CORS) for the frontend application.

## Technologies Used

-   **Runtime Environment**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ODM**: [Mongoose](https://mongoosejs.com/)
-   **Middleware**:
    -   [cors](https://www.npmjs.com/package/cors): For enabling CORS.
    -   [multer](https://www.npmjs.com/package/multer): For handling file uploads.
-   **Package Manager**: [npm](https://www.npmjs.com/)

## Project Structure

```
backend/
├── uploads/             # Directory for storing uploaded profile images
├── package.json         # Project metadata and dependencies
├── server.js            # Main Express application setup, API routes, and server start logic
└── README.md            # This file
```

## Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (which includes npm) installed globally.
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas connection string.
    -   The current connection string in [`server.js`](backend/server.js) points to MongoDB Atlas. Ensure you have access or replace it with your local MongoDB URI.

## Setup and Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies using npm:**
    ```bash
    npm install
    ```
    This command reads the [`package.json`](backend/package.json) file and installs all the necessary dependencies listed in `node_modules/`.

3.  **Ensure the `uploads/` directory exists:**
    The [`server.js`](backend/server.js) script attempts to create this directory if it doesn't exist, but you can also create it manually:
    ```bash
    mkdir -p uploads
    ```

4.  **Configure MongoDB Connection:**
    -   Verify the MongoDB connection string in [`server.js`](backend/server.js) is correct for your environment. It's currently set to:
        `mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/`
    -   It's recommended to use environment variables for sensitive information like database credentials instead of hardcoding them.

## Running the Backend Server

1.  **Start the server:**
    Assuming you have a `start` or `dev` script in your [`package.json`](backend/package.json) (like `nodemon server.js` or `node server.js`). Based on the root [`README.md`](README.md), the command is likely `npm run dev`. If not, you can run the server directly:
    ```bash
    # Using a potential dev script (recommended for development)
    npm run dev
    ```
    or
    ```bash
    # Directly using node
    node server.js
    ```

2.  The server will start, typically on port 5069 (as defined in [`server.js`](backend/server.js)). You should see a confirmation message in the console:
    ```
    MongoDB connected
    Server running on port 5069
    ```

## API Endpoints

The backend provides the following RESTful API endpoints, accessible under the `/api` prefix:

-   **`GET /api/members`**
    -   Description: Retrieves a list of all team members.
    -   Response: `200 OK` with a JSON array of member objects.
    -   Error Response: `500 Internal Server Error` if there's a database issue.

-   **`GET /api/members/:id`**
    -   Description: Retrieves a single team member by their unique MongoDB `_id`.
    -   Parameters: `id` (URL parameter) - The `_id` of the member.
    -   Response: `200 OK` with a JSON object of the member.
    -   Error Response:
        -   `404 Not Found` if no member with the given `id` exists.
        -   `500 Internal Server Error` if there's a database issue.

-   **`POST /api/members`**
    -   Description: Adds a new team member to the database. Expects `multipart/form-data` due to the file upload.
    -   Request Body (`multipart/form-data`):
        -   `name` (String, required)
        -   `role` (String, required)
        -   `email` (String, required)
        -   `phone` (String)
        -   `department` (String)
        -   `rollNumber` (String)
        -   `year` (String)
        -   `hobbies` (String - comma-separated, will be split into an array)
        -   `internship` (String)
        -   `certificates` (String - comma-separated, will be split into an array)
        -   `projects` (String - comma-separated, will be split into an array)
        -   `aboutYou` (String)
        -   `aim` (String)
        -   `profileImage` (File, required) - The profile picture (JPEG, JPG, PNG, max 2MB).
    -   Response: `201 Created` with the newly created member object as JSON.
    -   Error Response:
        -   `400 Bad Request` if required fields are missing, the file type is invalid, or the file size exceeds the limit.
        -   `500 Internal Server Error` if there's a database issue during insertion.

## File Uploads

-   Profile images are uploaded via the `POST /api/members` endpoint using Multer.
-   Accepted formats: `.jpeg`, `.jpg`, `.png`.
-   Maximum file size: 2MB.
-   Files are stored in the [`backend/uploads/`](backend/uploads/) directory with a timestamp prepended to the original filename to avoid collisions.
-   Uploaded files are served statically via the `/uploads` route (e.g., `http://localhost:5069/uploads/1678886400000-profile.png`). The path stored in the database for `profileImage` will be like `/uploads/your-image-name.jpg`.