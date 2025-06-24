# Expense Tracker (NestJS)

A Expense Tracker API built with **NestJS**, **TypeORM**, and **MySQL**, supporting role-based access control for **Admin** and **User**. Users can manage expenses, budgets, and generate reports, while Admins can oversee all data.

---

## Features

### Authentication
- Register & login using JWT
- Role-based access control (Admin, User)

### User
- Create/edit/delete personal expenses
- Set monthly budgets
- View budget alerts

### Admin
- View/manage all users
- View all expenses & budgets
- Generate global reports

---

## API Endpoints

### USER ENDPOINTS

#### Auth (User)

- POST /auth/register - Register a new user
- POST /auth/login - Login as user
- GET /auth/profile - Get logged-in user profile


#### Expenses (User)

- POST /expenses - Create a new expense
- GET /expenses - Get all expenses of the logged-in user
- GET /expenses/:id - Get a specific expense by ID (user-owned)
- PUT /expenses/:id - Update a specific expense (user-owned)
- DELETE /expenses/:id - Delete a specific expense (user-owned)
- GET /expenses/summary - Get category-wise expense summary


#### Budgets (User)

- POST /budgets - Create a new budget
- GET /budgets - Get all budgets of the logged-in user
- GET /budgets/report - Get budget report (summary + usage)


---

### ADMIN ENDPOINTS

#### Auth (Admin)

- POST /auth/register-admin - Register an admin (public access)
- POST /auth/admin/login - Login as admin
- GET /auth/users - Get list of all users
- PATCH /auth/users/:id/status - Update user status (active/inactive)


#### Expenses (Admin)

- GET /expenses/admin/all - Get all expenses (all users)
- GET /expenses/admin/user/:userId - Get expenses by user ID
- PUT /expenses/admin/:id - Update any user’s expense
- DELETE /expenses/admin/:id - Delete any user’s expense
- GET /expenses/admin/stats/total - Get total expense per user
- GET /expenses/admin/stats/monthly - Get monthly expense summary


#### Budgets (Admin)

- GET /budgets/admin/user/:userId - Get budgets of a specific user


---

## Tech Stack

- **NestJS**
- **TypeORM**
- **MySQL**
- **JWT** for authentication
- **Role-based Access Control**

---

## Create .env file in root

``` bash
DB_HOST=db_host
DB_PORT=db_port
DB_USERNAME=db_username
DB_PASSWORD=your_db_password
DB_NAME=db_name
JWT_SECRET=your_very_secret_key

```