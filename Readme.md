# Food Ordering Management System

A full-stack Food Ordering Management System built using React.js, FastAPI, and MySQL.

## 🚀 Features

### Customer
- User registration and login
- JWT-based authentication
- Browse food menu
- Search food items
- Add food to cart
- Update cart quantity
- Remove items from cart
- Place orders
- View order history
- Track order status

### Admin
- Admin authentication
- Dashboard
- Add, edit and delete categories
- Add, edit and delete food items
- Manage food availability
- View all orders
- Update order status
- View registered customers

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Axios
- React Router

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- bcrypt

### Database
- MySQL

## 📁 Project Structure

```text
Food-Ordering-System/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md