# Student Team Members Management Application

A full-stack application for managing student team members, built with React.js, Node.js, Express, and MongoDB.

## Project Description

This application allows users to:
- View team information on the home page
- Add new team members with profile images
- View a list of all team members
- View detailed information about individual team members

## Technologies Used

- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **File Upload**: Multer
- **HTTP Client**: Axios

## Project Structure

\`\`\`
├── frontend/                # React frontend
│   ├── public/              # Static files
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── App.js           # Main App component with routing
│       └── App.css          # Global styles
│
└── backend/                 # Node.js backend
    ├── uploads/             # Uploaded profile images
    └── server.js            # Express server and API endpoints
\`\`\`

## Installation

### Prerequisites

- Node.js and npm
- MongoDB (local installation or MongoDB Atlas)
- Visual Studio Code (or any code editor)
- MongoDB Compass (optional, for database management)

### Setup Instructions

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/your-team-name.git
   cd your-team-name
   \`\`\`

2. Install frontend dependencies:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

3. Install backend dependencies:
   \`\`\`bash
   cd ../backend
   npm install
   \`\`\`

4. Create uploads directory in backend (if not exists):
   \`\`\`bash
   mkdir -p uploads
   \`\`\`

5. Start MongoDB (if using local installation):
   \`\`\`bash
   mongod
   \`\`\`

6. Start the backend server:
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

7. Start the frontend development server:
   \`\`\`bash
   cd frontend
   npm start
   \`\`\`

8. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application provides the following API endpoints:

### GET /api/members
- Description: Retrieves all team members
- Response: Array of member objects
- Example response:
  \`\`\`json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "role": "Team Lead",
      "email": "john.doe@example.com",
      "phone": "+1 (555) 123-4567",
      "department": "Engineering",
      "joinDate": "2023-08-15T10:30:00.000Z",
      "profileImage": "/uploads/1691234567890.jpg"
    },
    ...
  ]
  \`\`\`

### GET /api/members/:id
- Description: Retrieves a specific team member by ID
- Parameters: id - The MongoDB ObjectId of the member
- Response: Member object
- Example response:
  \`\`\`json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "role": "Team Lead",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "department": "Engineering",
    "joinDate": "2023-08-15T10:30:00.000Z",
    "profileImage": "/uploads/1691234567890.jpg"
  }
  \`\`\`

### POST /api/members
- Description: Creates a new team member
- Request: FormData containing member details and profile image
- Response: Created member object
- Example request:
  \`\`\`
  FormData:
  - name: "John Doe"
  - role: "Developer"
  - email: "john.doe@example.com"
  - phone: "+1 (555) 123-4567"
  - department: "Engineering"
  - profileImage: [File]
  \`\`\`

## How to Run the App

1. Development mode:
   \`\`\`bash
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend (in a new terminal)
   cd frontend
   npm start
   \`\`\`

2. Build for production:
   \`\`\`bash
   cd frontend
   npm run build
   \`\`\`

## Contributors

- Your Name
- Team Members

## License

This project is licensed under the MIT License.
