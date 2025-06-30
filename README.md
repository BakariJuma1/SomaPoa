# SomaPoa - Bursary Application System 🎓

**SomaPoa** is a fullstack web application designed to help students apply for bursaries online and track their application progress. Admins can manage bursary programmes and monitor all applications in a secure and user-friendly platform.

---

## 🌐 Live Demo

👉 [Visit SomaPoa Dashboard](https://somapoa.netlify.app/dashboard)

---

## 📌 Features

### 🧑‍🎓 Student

- Register and log in securely
- View available bursary programmes
- Apply to bursaries
- Track application status

### 🛠️ Admin

- Add, update, and delete bursary programmes
- View all applicants and their details
- Review and manage applications

---

## 🛠️ Tech Stack

### Frontend
- HTML, CSS, JavaScript
- [Netlify](https://www.netlify.com/) for deployment

### Backend
- Python (Flask)
- PostgreSQL
- Flask-Migrate
- JWT Authentication
- Render for deployment

---

## 🚀 Getting Started (Development)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/BakariJuma1/SomaPoa.git
cd SomaPoa/backend

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_APP=app
export FLASK_ENV=development
export DATABASE_URL=postgresql://<username>:<password>@localhost/somapoa_db
export JWT_SECRET_KEY=your_jwt_secret_key

# Run migrations
flask db upgrade

# Start the server
flask run
Frontend Setup
bash
Copy
Edit
cd ../frontend
# Open index.html in your browser
🧪 API Endpoints (Sample)
Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	Login and get JWT token
GET	/programmes	Get list of all programmes
POST	/applications	Apply to a programme
GET	/applications/me	Get current user applications
POST	/admin/programmes	(Admin) Add a new programme
DELETE	/admin/programmes/<id>	(Admin) Delete a programme

📂 Project Structure
arduino
Copy
Edit
SomaPoa/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── auth/
│   │   └── ...
│   ├── migrations/
│   └── run.py
├── frontend/
│   ├── index.html
│   ├── dashboard.js
│   └── ...
🙌 Contributing
Contributions, feedback, and ideas are welcome! Let’s build this together.

📜 License
This project is licensed under the MIT License.

👨🏾‍💻 Built by
Bakari Isaac Juma


