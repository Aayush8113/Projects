# 🍽️ La Mansa | Premium Restaurant Platform

La Mansa is a luxury, high-performance restaurant web application built with **React 19** and **Vite 7**. This project showcases a sophisticated dark-mode aesthetic, centralized state management for e-commerce, and world-class motion design.



## 🌟 High-Level Features

* **🛒 Synchronized Order System**: Implemented a global `CartContext` using the React Context API to manage orders, quantities, and pricing in real-time across all components.
* **📅 Concierge Reservation Flow**: A multi-step, animated reservation system that guides users through party selection, scheduling, and personal details.
* **🎭 Motion Design**: Industry-standard animations including parallax background layers, character-splitting text effects, and glassmorphism UI powered by **Framer Motion**.
* **🔍 Intuitive Menu Filtering**: A high-speed menu grid featuring category toggles, search bars, and price sorting using optimized React hooks (`useMemo`).
* **📱 Modern Responsive Layout**: Fully optimized for every screen size with a focus on high-end mobile user experiences.

## 🛠️ Tech Stack

* **Core**: [React 19](https://react.dev/) & [Vite 7](https://vite.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Routing**: [React Router 7](https://reactrouter.com/)
* **State Management**: React Context API
* **Date Handling**: [date-fns](https://date-fns.org/) & [react-datepicker](https://reactdatepicker.com/)



## 📁 Project Structure

```text
src/
├── assets/       # High-resolution optimized images
├── components/   # Reusable UI (Navbar, DishCard, Footer, etc.)
├── context/      # Centralized Global State (CartContext)
├── data/         # Static JS objects (dishes, chefs, testimonials)
├── pages/        # Main route views (Home, Menu, Cart, Contact, About)
└── App.jsx       # Layout entry point and route definitions