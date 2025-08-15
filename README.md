# 🌍 Travel Agency Dashboard

A complete **Travel Agency Management System** built with **React Router v7**, **Vite**, **TailwindCSS**, and **Appwrite**.  
This project allows **admins** to manage trips, users, and content — with the help of **AI (Google Gemini)** and **Unsplash API** to generate rich descriptions and images automatically.

---

## 📖 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [How It Works](#how-it-works)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Deployment](#deployment)
9. [Screenshots](#screenshots)
10. [License](#license)

---

## 📝 Overview

The **Travel Agency Dashboard** is designed to simplify managing travel packages, customers, and trip content.  
It combines **modern frontend tools** with **cloud-based backend services** so you don’t have to build everything from scratch.

Core ideas:
- **Fast Frontend:** Built with Vite for instant development feedback.
- **Dynamic Routing:** Admin dashboard has multiple nested routes.
- **Automated Content:** Gemini AI + Unsplash API generate engaging trip descriptions and images instantly.
- **Secure Backend:** Appwrite handles authentication, database, and storage.

---

## ✨ Features

### 🔑 Admin Tools
- **Dashboard Overview:** See quick stats like total trips, users, and recent activity.
- **User Management:** View all registered customers.
- **Trip Management:**
  - Create new trips with a simple form.
  - AI-generated trip descriptions via **Google Gemini**.
  - Automatic image fetching via **Unsplash API**.
  - View trip details in a dedicated page.

### 🤖 Automated Content Generation
- **Google Gemini:** Generates SEO-friendly descriptions for each trip.
- **Unsplash API:** Fetches high-quality destination images without manual uploads.

### 🎨 Modern UI/UX
- Responsive design using **TailwindCSS**.
- DaisyUI components for pre-styled UI elements.
- Dark mode and consistent spacing system.

---

## 🛠 Tech Stack

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **React Router v7** | Handles routing and layouts | Perfect for building nested admin routes like `/trips/:tripId` |
| **Vite** | Build tool & dev server | Extremely fast hot-reloading during development |
| **TailwindCSS + DaisyUI** | Styling framework | Easy-to-customize, mobile-friendly UI without writing too much CSS |
| **Appwrite** | Backend-as-a-Service | Manages authentication, databases, and storage securely |
| **Google Gemini API** | AI-generated descriptions | Saves time creating content and improves trip marketing |
| **Unsplash API** | Destination images | Automatically fetches copyright-safe travel photos |

---

## 🔍 How It Works

1. **Admin Login**  
   Admin logs in via Appwrite authentication. Role-based access ensures only authorized users can access admin routes.

2. **Creating a Trip**  
   - Admin fills out the **Create Trip Form**.
   - A request is sent to `/api/create-trip`.
   - The backend function:
     - Calls **Google Gemini API** to generate the trip description.
     - Calls **Unsplash API** to get a related image.
     - Saves all details in **Appwrite Database**.

3. **Displaying Trips**  
   The dashboard fetches data from Appwrite and displays it in the admin panel with images and details.

4. **User View**  
   Non-admin users can browse trips (if you enable a public view in the future).

