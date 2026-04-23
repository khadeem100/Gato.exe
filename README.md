# GatoSports Sales Rep Desktop

A modern desktop application for GatoSports sales representatives. Built with **Electron + React + TailwindCSS**.

## Features

- **Dashboard** — Real-time overview of sales activity, revenue, and recent orders
- **Customers** — Browse and search assigned customers with order history
- **Orders** — View all orders with live sync, search, and pagination
- **Settings** — Account info, connection status, and version management
- **Auto-Update** — Built-in notification system when new versions are available
- **Live Sync** — All data is fetched in real-time from the GatoSports server

## Design

- Modern dark theme using **black, white, and grey** color palette
- Clean, minimalist UI with smooth transitions
- Responsive layout with sidebar navigation

## Development

```bash
# Install dependencies
npm install

# Run in development mode (hot-reload)
npm run dev
```

## Building

### Windows (.exe)
```bash
npm run dist
```
Output: `release/GatoSports Sales Rep Setup.exe`

### Linux (AppImage)
```bash
npm run dist:linux
```

### macOS (DMG)
```bash
npm run dist:mac
```

## Architecture

```
├── electron/         # Electron main process
│   ├── main.js       # Window management, auto-updater
│   └── preload.js    # IPC bridge to renderer
├── src/              # React frontend
│   ├── api.js        # REST API client
│   ├── contexts/     # Auth state
│   ├── components/   # Layout, Sidebar, TopBar, UpdateNotification
│   └── pages/        # Dashboard, Customers, Orders, Settings
├── assets/           # App icons (add icon.ico for Windows)
└── package.json      # Dependencies and build config
```

## API Server

The app connects to `https://gato-companion.gato-international.com/salesrep/*` endpoints:

| Endpoint | Description |
|---|---|
| `POST /salesrep/auth/login` | Authenticate with PrestaShop credentials |
| `GET /salesrep/version` | Check for latest version |
| `GET /salesrep/dashboard` | Dashboard stats and recent orders |
| `GET /salesrep/customers` | List all customers |
| `GET /salesrep/customers/:id` | Customer detail with orders & addresses |
| `GET /salesrep/orders` | Paginated order list |
| `GET /salesrep/orders/:id` | Order detail with products & addresses |
| `GET /salesrep/products/search` | Search products by name |

## Auto-Update

The app checks for updates:
1. On startup (after 10 seconds)
2. Every 30 minutes automatically
3. Manually via Settings → Check for Updates

When an update is available, a notification appears at the bottom-right corner. Users can download and install with one click.

## Icons

Place your app icon files in the `assets/` directory:
- `icon.ico` — Windows (256×256 multi-res ICO)
- `icon.png` — Linux (512×512 PNG)
- `icon.icns` — macOS (multi-res ICNS)
