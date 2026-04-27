# TradeNotify - Professional Trading Terminal

TradeNotify is a high-performance, full-stack trading dashboard designed for real-time market analysis, institutional setup detection, and strategy management. Built with a modern tech stack and premium "Obsidian Architect" aesthetics, it provides a seamless experience for both desktop and mobile users.

## 🚀 Features

- **Real-time Candlestick Charts**: Powered by `lightweight-charts` for high-precision data visualization.
- **Interactive Drawing Tools**: Custom-built drawing layer for technical analysis, including trendlines.
- **Dynamic Timeframes**: Switch between multiple intervals (1m, 5m, 15m, 1h, 1d) with instant synchronization.
- **Secure Authentication**: JWT-based login and registration with encrypted password storage.
- **Personalized Wishlist**: Track favorite stocks and quickly launch charts from a unified dashboard.
- **Premium UI/UX**: Dark-themed, glassmorphic design using Tailwind CSS and Radix UI (shadcn/ui).
- **Responsive Layout**: Optimized for all screen sizes with a professional terminal feel.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Charting**: Lightweight Charts (TradingView)
- **Fonts**: Geist Variable

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT & BcryptJS
- **API Clients**: Axios
- **Middleware**: CORS, Cookie-Parser, Dotenv

## 📈 Project Flow

1.  **Onboarding**: Users start at the **Login** or **Register** page. Authentication is handled via JWT, which is stored securely and loaded on app initialization via a custom `useAuth` hook.
2.  **Command Center (Dashboard)**: After logging in, users are greeted by a professional landing zone. From here, they can see their **Wishlist** or use the search experience to find new symbols.
3.  **Analysis (Chart Page)**:
    - Launching a chart takes the user to `/charts/:symbol`.
    - The `ChartContainer` fetches historical candle data from the backend.
    - Users can switch intervals via a custom dropdown, which triggers a re-fetch and re-render of the chart.
    - The **Drawing Layer** allows users to select tools (like trendlines) and draw directly on top of the market data.
4.  **Portfolio Management**: Users can add or remove stocks from their **Wishlist** directly from the chart page or dashboard, with state managed globally via Redux.

## 📦 Key Packages & Implementations

### Lightweight Charts
The heart of the application is the `lightweight-charts` integration in `ChartContainer.jsx`. It features:
- Solid background layouts for a premium dark look.
- Custom crosshair styles and grid configurations.
- Responsive resizing using `ResizeObserver` logic.
- Integration with a custom `DrawingLayer` for persistent technical analysis.

### Custom Drawing Layer
Unlike standard chart implementations, TradeNotify includes a custom SVG/Canvas-based `DrawingLayer` that:
- Captures mouse events on the chart area.
- Translates coordinates into time/price values.
- Allows for "active tool" selection (e.g., Trendlines).

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/TradeNotify.git
cd TradeNotify
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```
Run the frontend:
```bash
npm run dev
```

---

*Developed with ❤️ by Abhishek Jaiswal*
