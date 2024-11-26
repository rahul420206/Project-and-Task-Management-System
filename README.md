
# Project and Task Management System

This repository hosts the **Project and Task Management System**, designed to help users efficiently manage projects and their associated tasks. It includes a backend API implemented in **Spring Boot** and a frontend built with **React.js**.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Steps to Run the Project](#steps-to-run-the-project)
- [How the Application Works](#how-the-application-works)
- [Technologies Used](#technologies-used)
- [Known Issues](#known-issues)
- [Contributors](#contributors)

---

## Features

### **1. Login Page**
A user-friendly login page for secure access.

![Project Creation](frontend/public/2.png)

### **2. Project Management**
- **Create**, **view**, **update**, and **delete** projects.
- Automatically delete all associated tasks when a project is deleted.

#### Project Creation:
![Project Creation](frontend/public/PC.png)

#### Updating Projects:
![Updating Projects](frontend/public/PU.png)

### **3. Task Management**
- Add tasks associated with specific projects.
- Update task descriptions and statuses (**pending**/**completed**).
- Delete individual tasks.

#### Adding Tasks:
![Adding Tasks](frontend/public/AT.png)

#### Updating Tasks:
![Updating Tasks](frontend/public/UT.png)

### **4. Database Integration**
- Uses a relational database (e.g., Oracle) for persistent storage.
- Automatic cascading deletes for tasks when a project is removed.

### **5. User Interface**
- A responsive and interactive web interface.
- Inline form validation and error handling.

  ![Project Creation](frontend/public/1.png)

### **6. Exporting Projects**
Export projects as Gists for easy sharing.

![Exporting Gists](frontend/public/Gist.png)

---

## Prerequisites
Ensure the following tools and environments are set up:
- **Java (JDK 11 or later)**
- **Maven (Build Tool)**
- **Node.js and npm**
- **Oracle Database** (or any compatible RDBMS)
- **Git** (for cloning the repository)

---

## Steps to Run the Project

### **1. Clone the Repository**
```bash
git clone https://github.com/rahul420206/Project-and-Task-Management-System.git
cd project-task-management
```

### **2. Set Up the Database**
1. Open your database tool (e.g., SQL Developer, DBeaver).
2. Create a new database schema.
3. Execute the following SQL script to create the necessary tables:
   ```sql
   -- Create Project table
   CREATE TABLE Project (
       id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
       title VARCHAR2(255) NOT NULL,
       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create Todo table
   CREATE TABLE Todo (
       id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
       project_id NUMBER NOT NULL,
       description VARCHAR2(255) NOT NULL,
       status NUMBER(1) DEFAULT 0 CHECK (status IN (0, 1)), -- 0 for pending, 1 for complete
       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
   );

   -- Optional: Create an index
   CREATE INDEX idx_project_id ON Todo (project_id);
   ```

### **3. Configure Backend**
1. Navigate to the backend folder:
   ```bash
   cd hello
   ```
2. Update the `application.properties` file:
   ```
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

3. Run the backend server:
   ```bash
   mvn spring-boot-run
   ```
   The application will be available at **http://localhost:8080**.

### **4. Configure Frontend**
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend server:
   ```bash
   npm start
   ```
   The application will be available at **http://localhost:3000**.

---

## How the Application Works

### Create a Project
- Enter a project title to create a new project.
- The project is stored in the `Project` table.

### Add Tasks
- Select a project and add tasks associated with it.
- Each task is stored in the `Todo` table, linked to the corresponding project.

### Update Task Status
- Mark tasks as **pending** (0) or **complete** (1).

### Error Handling
- The application handles invalid actions gracefully, showing appropriate error messages.

---

## Technologies Used

### Backend
- **Spring Boot** (REST API)
- **Hibernate** (ORM)
- **Oracle Database**

### Frontend
- **React.js** (UI)
- **Axios** (HTTP Client)

---

## Known Issues
- **Cascading Delete:** A project can only be deleted when all associated tasks are deleted. Modify the table schema to set `ON DELETE CASCADE` for automated deletion.

---

## Contributors
- **Rahul Matta** - Developer and Maintainer
