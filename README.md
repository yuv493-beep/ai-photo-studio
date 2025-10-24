# AI Product Photo Studio - Full-Stack SaaS Application

This repository contains the complete frontend and backend code for a production-ready SaaS application built on a modern Google Cloud stack. It features user authentication with **Firebase Authentication**, a serverless backend on **Cloud Run**, and a **Cloud SQL for PostgreSQL** database.

## Project Structure

```
/
├── backend/         # Node.js, Express, TypeScript Backend for Cloud Run
├── db/              # PostgreSQL database schema for Cloud SQL
├── frontend/        # React, Vite Frontend for Cloud Storage Hosting
└── README.md        # This file
```

## Prerequisites

- **Node.js**: v18 or later
- **Google Cloud Project**: A new or existing GCP project.
- **Firebase Project**: Create a Firebase project within your GCP project.
- **PostgreSQL Instance**: A running Cloud SQL for PostgreSQL instance.
- **Gemini API Key**: Get one from [Google AI Studio](https://ai.google.dev/)
- **Paytm Merchant Credentials**: Get your Merchant ID and Merchant Key from your [Paytm Dashboard](https://dashboard.paytm.com/)

---

## 1. Firebase & Google Cloud Setup

### A. Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and add a new project, selecting your existing Google Cloud Project.
2. In your new Firebase project, go to **Authentication** -> **Sign-in method**.
3. Enable the **Email/Password** and **Google** providers.
4. Go to **Project Settings** -> **General**. In the "Your apps" card, click the web icon (`</>`) to create a new web app.
5. Give it a name and register the app. **Copy the `firebaseConfig` object**. You will need this for the frontend.

### B. Setup Backend Service Account
1. In the GCP Console, go to **IAM & Admin** -> **Service Accounts**.
2. Find the default App Engine service account (`[PROJECT_ID]@appspot.gserviceaccount.com`) or create a new one.
3. Grant this service account the **Firebase Admin** and **Cloud SQL Client** roles.
4. Click on the service account, go to the **Keys** tab, click **Add Key** -> **Create new key**, and download the JSON file.
5. **Keep this file secure!** It provides admin access to your Firebase project.

---

## 2. Database Setup (Cloud SQL)

### A. Create a Database
1. In your Cloud SQL instance, create a new database. For example, `aistudio_db`.
2. Create a database user and set a password.

### B. Run the Schema
Use a PostgreSQL client (like `psql` or a GUI tool) to connect to your new database and execute the SQL commands in `db/schema.sql`.

```bash
# Example using psql with the Cloud SQL Auth Proxy
./cloud_sql_proxy -instances="YOUR_INSTANCE_CONNECTION_NAME"
# In another terminal:
psql "host=127.0.0.1 port=5432 sslmode=disable dbname=YOUR_DB_NAME user=YOUR_DB_USER" -f db/schema.sql
```

This will create all the necessary tables (`users`, `plans`, `subscriptions`, etc.) compatible with Firebase Authentication and populate the default pricing plans.

---

## 3. Backend Setup (for Cloud Run)

### A. Installation

```bash
cd backend
npm install
```

### B. Environment Variables
Create a `.env` file in the `backend/` directory. For local development, this file will configure your application.

```
# Server Configuration
PORT=8080

# Database Connection (for local dev with Cloud SQL Proxy)
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@127.0.0.1:5432/YOUR_DB_NAME"

# Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Paytm Credentials
PAYTM_MID="YOUR_PAYTM_MERCHANT_ID"
PAYTM_MERCHANT_KEY="YOUR_PAYTM_MERCHANT_KEY"
PAYTM_WEBSITE="WEBSTAGING"
PAYTM_CALLBACK_URL="http://localhost:8080/api/payments/callback"

# Client URL for CORS
CLIENT_URL="http://localhost:3000"

# Firebase Service Account for local development
# Point this to the JSON key file you downloaded
GOOGLE_APPLICATION_CREDENTIALS="./path/to/your/service-account-file.json"
```

### C. Running the Backend Locally

```bash
npm run dev
```

The backend API will be running at `http://localhost:8080`.

---

## 4. Frontend Setup

### A. Installation

```bash
cd frontend
npm install
```

### B. Environment Variables

Create a `.env` file in the `frontend/` directory and add your Firebase web app configuration that you copied earlier.

```
VITE_API_URL="http://localhost:8080/api"

# Paste your Firebase config here
VITE_FIREBASE_API_KEY="AIza..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="12345..."
VITE_FIREBASE_APP_ID="1:12345:web:abcd..."
```

### C. Running the Frontend

```bash
npm run dev
```

Your SaaS application will be accessible at `http://localhost:3000`.

---

## Development Workflow

1.  Make sure your Cloud SQL instance is running.
2.  Start the Cloud SQL Auth Proxy.
3.  Start the backend server: `cd backend && npm run dev`.
4.  Start the frontend server: `cd frontend && npm run dev`.
5.  Open your browser to `http://localhost:3000`.

You can now register a user with Firebase Auth, verify your email, subscribe to a plan, and use the AI studio!
