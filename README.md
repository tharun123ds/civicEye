
# 🏙️ Civic Eye – Citizen Issue Reporting Platform

**Civic Eye** is a full-stack web application enabling citizens to report civic issues with ease and transparency. Built using the **MERN stack** with **CI/CD integration**, 
this guide walks you through local setup, deployment, and DevOps configuration.

---

## 📦 1. Prerequisites Setup

### 1.1 Install Node.js (v18+)
- [Download Node.js](https://nodejs.org)
- Verify:
  ```bash
  node --version
  npm --version
````

### 1.2 Install MongoDB

* **Option A**: MongoDB Compass (Local)

  * Install and ensure service is running.
* **Option B**: MongoDB Atlas (Recommended)

  * [Sign Up](https://www.mongodb.com/cloud/atlas)
  * Create cluster, configure IP and DB user.

### 1.3 Install Git

* [Download Git](https://git-scm.com)
* Verify:

  ```bash
  git --version
  ```

### 1.4 Install Docker *(Optional)*

* [Download Docker](https://www.docker.com/products/docker-desktop)
* Verify:

  ```bash
  docker --version
  ```

---

## 📁 2. Clone and Configure Civic Eye

```bash
git clone https://github.com/tharun123ds/civicEye.git
cd civicEye
ls -la
cd backend
```

---

## 🛠️ 3. Backend Setup (Node.js + MongoDB)

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Configure Environment

Create a `.env` file:

```bash
touch .env
```

Add the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/civicEye
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

### 3.3 Run Backend Server

```bash
npm run dev
```

---

## 🎨 4. Frontend Setup (React + Vite + Tailwind)

### 4.1 Navigate to Frontend

```bash
cd ../frontend
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Configure Environment

```bash
echo "VITE_API_URL=http://localhost:5000" > .env
```

### 4.4 Start Frontend Server

```bash
npm run dev
```

---

## ☁️ 5. MongoDB Atlas Setup (Optional)

### 5.1 Create Cluster

* Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
* Create project and cluster

### 5.2 Configure Access

* Network Access: Allow `0.0.0.0/0` (dev)
* Add DB user credentials

### 5.3 Update `.env`

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/civicEye
```

---

## 🔁 6. GitHub Actions (CI/CD)

### 6.1 Add Repository Secrets

GitHub → Repo → Settings → Secrets → Actions → Add:

* `MONGO_URI`
* `JWT_SECRET`

### 6.2 Workflow Configuration

* Located in `.github/workflows/`
* Triggered on push and PR events

---

## 🧪 7. Jenkins CI/CD (Optional)

### 7.1 Jenkins Installation

* Host on EC2 or local machine
* Access via IP or domain

### 7.2 CI/CD Pipeline Stages

* **Build:** `npm install`
* **Lint/Test:** `npm run lint` / `npm test`
* **Dockerize:** `docker build .`
* **Deploy:** SSH/SCP to server, restart services

---

## 🔐 8. CORS Configuration

In `backend/app.js`:

```js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 🧪 9. Local Testing

### 9.1 API Test

```bash
curl http://localhost:5000/api/health
```

### 9.2 Frontend Test

Visit: [http://localhost:3000](http://localhost:3000)
Check login, register, and report submission.

### 9.3 MongoDB Access

```bash
mongosh
use civicEye
show collections
```

---

## 🚀 10. Production Deployment Verification (Jenkins)

* Push triggers Jenkins CI/CD
* Monitor console logs
* Visit deployed URL: `http://<your-ec2-ip>:5000`

---

## 🔐 11. Security Best Practices

* Do **NOT** commit `.env` files
* Use strong `JWT_SECRET`
* Restrict MongoDB IP access
* Enable branch protection in GitHub
* Use **HTTPS** in production

---

## 🛠️ 12. Troubleshooting

### Port Already in Use

```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB Not Connecting

* Check `mongod` service
* Ensure `.env` has correct `MONGO_URI`

### Build Errors

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Done
