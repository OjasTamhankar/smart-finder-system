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

Create `smart-finder-frontend/.env` from `smart-finder-frontend/.env.example` if you want configurable API URLs or Firebase Web Push support.

### Backend

```bash
cd smart-finder-backend
npm install
npm start
```

Create `smart-finder-backend/.env` from `smart-finder-backend/.env.example` before starting the backend.

The backend expects MongoDB, Cloudinary, email, and optional Firebase configuration through environment variables.

## Push Notifications

Push notifications require configuration on both apps:

- Frontend: Firebase web app keys and `REACT_APP_FIREBASE_VAPID_KEY`
- Backend: Firebase Admin credentials through `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_SERVICE_ACCOUNT_PATH`, or the `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` trio

If backend Firebase Admin credentials are missing, the API will still run but server-side push delivery stays disabled until those values are provided.

## Repository Notes

This repository intentionally keeps only the Smart Finder application source and essential setup files. Generated uploads, local environment files, duplicate source trees, diagrams, and unrelated project documents stay out of Git.
