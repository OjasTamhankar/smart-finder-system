# Smart Finder

Smart Finder is a lost-and-found web application with separate frontend and backend projects in this repository.

## Project Structure

- `smart-finder-frontend/` contains the React client.
- `smart-finder-backend/` contains the Express and MongoDB API.

## Getting Started

### Frontend

```bash
cd smart-finder-frontend
npm install
npm start
```

### Backend

```bash
cd smart-finder-backend
npm install
npm start
```

Create `smart-finder-backend/.env` from `smart-finder-backend/.env.example` before starting the backend.

The backend expects MongoDB, Cloudinary, email, and optional Firebase configuration through environment variables.

## Repository Notes

This repository intentionally keeps only the Smart Finder application source and essential setup files. Generated uploads, local environment files, duplicate source trees, diagrams, and unrelated project documents stay out of Git.
