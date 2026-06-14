# LINEAR_DEVOPS_BOARD

A full-stack Kanban board with a React/TypeScript frontend, Node.js/Express API, and MongoDB — containerized with Docker and deployable via Jenkins CI/CD.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB 7 (Mongoose) |
| DevOps | Docker, Docker Compose, Jenkins |

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js v20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/GrowthCoder7/devops_kanban_board.git
cd devops_kanban_board
```

---

## Option A — Run with Docker Compose (Recommended)

This spins up both the app and MongoDB with a single command. No manual setup needed.

```bash
docker-compose up --build
```

- App → http://localhost:5000
- MongoDB → `mongodb://localhost:27017/kanban`

To stop and remove containers:

```bash
docker-compose down
```

To also wipe the database volume:

```bash
docker-compose down -v
```

---

## Option B — Run Locally (Manual Setup)

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kanban
```

> Make sure MongoDB is running locally on port `27017`. You can run it via Docker:
> ```bash
> docker run -d -p 27017:27017 --name mongo mongo:7.0
> ```

### 4. Build the Frontend

```bash
cd frontend
npm run build
cd ..
```

This compiles the React app into `frontend/dist/`, which the Express server will serve as static files from the `public/` folder.

### 5. Start the Backend Server

```bash
npm start
```

App is now live at → http://localhost:5000

---

## Development Mode (Hot Reload)

Run the backend and frontend separately for a live development experience.

**Terminal 1 — Backend:**
```bash
npm start
```

**Terminal 2 — Frontend (Vite dev server with HMR):**
```bash
cd frontend
npm run dev
```

Frontend dev server → http://localhost:5173  
Backend API → http://localhost:5000/api/tasks

> In dev mode, configure Vite to proxy `/api` requests to `localhost:5000` by adding this to `frontend/vite.config.ts`:
> ```ts
> server: {
>   proxy: {
>     '/api': 'http://localhost:5000'
>   }
> }
> ```

---

## API Reference

Base URL: `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

**POST body example:**
```json
{
  "title": "Fix login bug",
  "description": "OAuth token expiry not handled",
  "priority": "HIGH",
  "storyPoints": 3
}
```

**Valid values:**
- `status`: `TODO` | `IN_PROGRESS` | `DONE`
- `priority`: `LOW` | `MEDIUM` | `HIGH`
- `storyPoints`: `1 | 2 | 3 | 5 | 8`

---

## CI/CD with Jenkins

The `Jenkinsfile` automates build and deployment.

### Setup Steps

1. Install Jenkins and ensure Docker is available on the Jenkins agent.

2. Create a new **Pipeline** job in Jenkins and point it to this repository.

3. The pipeline runs these stages automatically on each push:

   | Stage | What it does |
   |---|---|
   | Checkout Code | Pulls latest code from GitHub |
   | Build Docker Image | Builds the production image as `kanban-api-real:latest` |
   | Deploy to Production | Stops the old container, starts a new one on port `5050` |

4. After a successful pipeline run, the app is accessible at:
http://<your-server-ip>:5050

> The Jenkins container connects to MongoDB via the shared Docker network (`devops_kanban_board_default`). Make sure the `kanban-db` container (from Docker Compose) is running before triggering the pipeline.

---

## Project Structure
devops_kanban_board/

├── src/

│   ├── server.js          # Express app entry point

│   ├── models/Task.js     # Mongoose schema

│   └── routes/taskRoutes.js

├── frontend/

│   └── src/

│       ├── App.tsx        # Main React component

│       └── App.css        # All styles

├── Dockerfile             # Multi-stage build (React → Node)

├── docker-compose.yml     # App + MongoDB orchestration

├── Jenkinsfile            # CI/CD pipeline

└── package.json

---

## Troubleshooting

**MongoDB connection refused**
- Ensure MongoDB is running: `docker ps` or check your local Mongo service.

**Port already in use**
- Change `PORT` in `.env` or update the port mapping in `docker-compose.yml`.

**Frontend changes not reflected**
- Rebuild the frontend: `cd frontend && npm run build`, then restart the server.

**Jenkins can't connect to kanban-db**
- Confirm the Docker Compose stack is up (`docker-compose up -d`) so the `devops_kanban_board_default` network and `kanban-db` container exist.
