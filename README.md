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
- **External API**: Yahoo Finance API

## 📉 Charting Implementation

### How Charts are Created
The application utilizes the **Lightweight Charts API** by TradingView. In `ChartContainer.jsx`:
1.  **Initialization**: A `createChart` instance is attached to a DOM ref. Custom colors, grid lines, and crosshair styles are applied to match the Obsidian Architect theme.
2.  **Series Management**: A `CandlestickSeries` is added to the chart instance.
3.  **Data Fetching**: Historical candle data is fetched from the internal `/api/market/candles` endpoint.
4.  **Data Transformation**: Raw timestamps and price data are cleaned and sorted before being passed to `series.setData()`.
5.  **Responsiveness**: A `ResizeObserver` (via `useEffect` resize listener) ensures the chart always fills its container.

### Trendlines & Drawings
TradeNotify features a custom-built **Imperative Drawing Engine** (`DrawingLayer.jsx`) that sits as an SVG overlay on top of the chart:
- **Synchronization**: To prevent "jitter" during zoom/drag, we use `requestAnimationFrame`. This loop calculates the exact pixel coordinates for every drawing in every frame using `chart.timeScale().timeToCoordinate(time)` and `series.priceToCoordinate(price)`.
- **Imperative Rendering**: Instead of React state, we use **Refs** to directly manipulate SVG attributes (`x1`, `y1`, `x2`, `y2`). This bypasses React's reconciliation for maximum performance (0ms latency).
- **Coordinate Persistence**: Drawings are stored as `{ time, price }` pairs. This ensures they stay anchored to the correct candles even when you switch timeframes or scroll through history.

## 📡 API Reference

### External Data Source
All market data is fetched in real-time from the **Yahoo Finance API** (`query1.finance.yahoo.com`). The backend cleanses this data, handling market halts and null values to ensure chart stability.

### Backend Endpoints
| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Create a new user account |
| **Auth** | `/api/auth/login` | `POST` | Authenticate and receive JWT |
| **Auth** | `/api/auth/me` | `GET` | Get current user profile (Protected) |
| **Market** | `/api/market/candles` | `GET` | Fetch historical OHLC data |
| **Market** | `/api/market/intervals`| `GET` | Get supported timeframes |
| **Stocks** | `/api/stocks/search` | `GET` | Search for symbols (NSE/BSE) |
| **Wishlist**| `/api/wishlist` | `GET` | Retrieve user's watchlist |
| **Wishlist**| `/api/wishlist` | `POST` | Add symbol to watchlist |

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/Jais-Abhi/Trade-Notify.git
cd Trade-Notify
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

