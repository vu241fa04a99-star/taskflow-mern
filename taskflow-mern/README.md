# TaskFlow – MERN Task Manager

A full-stack task manager built with MongoDB, Express, React and Node.js.

## Features
- Create tasks with an optional description
- View all tasks
- Mark tasks as completed or active
- Filter all, active and completed tasks
- Delete tasks
- MongoDB persistence through a REST API

## Requirements
- Node.js (LTS)
- VS Code
- MongoDB Atlas account or local MongoDB

## Setup

### 1. Configure MongoDB
Create a free MongoDB Atlas cluster. Create a database user, allow your current IP address in Network Access, and copy the Node.js connection string.

In `server`, copy `.env.example` to `.env` and replace the sample value:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```
Replace `<password>` in the connection string with your database user's password. Do not share or commit `.env`.

### 2. Start the backend
Open a terminal in the project root:
```bash
cd server
npm install
```
Create `server/.env` from `.env.example`, then run:
```bash
npm run dev
```
The API runs at http://localhost:5000.

### 3. Start the frontend
Open a second VS Code terminal:
```bash
cd client
npm install
```
Create `client/.env` from `.env.example` (or use the default localhost URL), then run:
```bash
npm run dev
```
Open the local URL shown by Vite, usually http://localhost:5173.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update completion |
| DELETE | `/api/tasks/:id` | Delete a task |

## GitHub
Run these commands from the project root:
```bash
git init
git add .
git commit -m "Initial commit: TaskFlow MERN project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/taskflow-mern.git
git push -u origin main
```
Create an empty repository on GitHub first and replace `YOUR-USERNAME` with your GitHub username. Do not add a README, license or .gitignore on GitHub if you already have this project locally.

## Important
- `.env` files are ignored by Git. Only `.env.example` files should be pushed.
- Never upload MongoDB passwords, API keys or other secrets.
