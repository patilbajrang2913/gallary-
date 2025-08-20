MEMBERS:
1. BAJRANG PATIL(SESP).
2. VAISHALI CHARGUNDI(SESP).

Gallary

A simple, secure image gallery app where users can sign up, log in, and upload images. Each user only sees their own uploads.
Built with a modern frontend, backend API, and PostgreSQL as the database.

✨ Features

🔐 Authentication (sign up / login / logout)

🖼️ Image upload and storage

👤 Per-user gallery (users see only their own images)

🗂️ Database-driven with PostgreSQL

📱 Responsive UI for desktop & mobile

🛠️ Tech Stack

Frontend: React (Vite) + Tailwind CSS

Backend: Node.js (Express)

Database: PostgreSQL

ORM/Query Builder: Prisma / Sequelize / Knex (depending on what you used)

Authentication: JWT-based (or session-based)

gallary/
├── backend/             # Express/Node.js backend
│   ├── src/
│   │   ├── routes/      # API routes (auth, uploads, gallery)
│   │   ├── models/      # DB models / schema
│   │   ├── controllers/ # Route controllers
│   │   └── db.js        # PostgreSQL connection
│   └── package.json
│
├── frontend/            # React (Vite) app
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Login, Signup, Gallery
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml   # (Optional) for PostgreSQL setup
├── README.md
└── .env.example         # Example env vars


⚙️ Setup
1) Prerequisites

Node.js 18+

PostgreSQL installed (or Docker)

2) Clone
   git clone https://github.com/patilbajrang2913/gallary.git
cd gallary

3) Install dependencies

Backend:
cd backend
npm install


Frontend:
cd frontend
npm install


4) Database Setup
   CREATE DATABASE gallary;

Create a PostgreSQL database:

CREATE DATABASE gallary;


Add tables (example schema):

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL, -- hashed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5) Environment Variables

Create .env files in backend:

# backend/.env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/gallary
JWT_SECRET=supersecretkey
UPLOAD_DIR=uploads


And in frontend:

# frontend/.env
VITE_API_URL=http://localhost:5000

6) Run the app

Backend:

cd backend
npm run dev


Frontend:

cd frontend
npm run dev


Visit http://localhost:5173

🔑 API Endpoints (example)
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user & return JWT
GET	/api/gallery	Get logged-in user’s images
POST	/api/upload	Upload image
DELETE	/api/image/:id	Delete image
🚀 Roadmap

Add image captions & tags

Implement search & filters

Add sharing & public galleries

Add image compression & thumbnail previews

🤝 Contributing

Fork the repo

Create a branch (git checkout -b feature-name)

Commit your changes (git commit -m "feat: add something")

Push to your branch (git push origin feature-name)

Create a Pull Request

📜 License

This project is licensed under the MIT License.
