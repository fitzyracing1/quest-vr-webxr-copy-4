# 🍔 GrubHub Food Ordering System - Visual Guide

## User Interface Flow

```
┌─────────────────────────────────────────────────────────┐
│  Your VR Game                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Quest WebXR World                               │   │
│  │                                                  │   │
│  │  [3D Game World with Players and Blocks]        │   │
│  │                                                  │   │
│  │                      🍔 ← Click Me!             │   │
│  │                  [Order Food Button]            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ↓ (Click on button)
┌─────────────────────────────────────────────────────────┐
│  🍔 GrubHub Shop Panel                              [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Player Name: [VR Player        ]                      │
│                                                         │
│  📋 Menu:                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🍔 Juicy Burger                              [0]  │  │
│  │    Classic burger with toppings - $8.99        │  │
│  │ 🍕 Pepperoni Pizza                         [0]  │  │
│  │    Large pepperoni pizza - $12.99             │  │
│  │ 🌮 Tacos (3)                              [0]  │  │
│  │    Delicious street tacos - $9.99             │  │
│  │ [more items...]                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  🛒 Cart:                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 2x 🍔 Juicy Burger                    $17.98    │  │
│  │ 1x 🍟 Crispy Fries                     $3.99    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Total: $21.97                                         │
│                                                         │
│  📦 Your Orders:                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ORD-1773852562915-ABC123 - $21.97              │  │
│  │    Status: confirmed                            │  │
│  │ ORD-1773852499999-XYZ789 - $8.99               │  │
│  │    Status: confirmed                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [✓ Place Order]  [Clear Cart]                         │
└─────────────────────────────────────────────────────────┘
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VR Game (Frontend)                       │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  index.html                                            │   │
│  │  - A-Frame scene                                       │   │
│  │  - WebXR/Quest controls                               │   │
│  │  - HUD with stats                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ grubhub-shop.js (UI Component)                           │  │
│  │                                                          │  │
│  │  ├─ createShopUI()                                      │  │
│  │  ├─ loadMenu()          ──→ GET /api/grubhub/menu     │  │
│  │  ├─ updateCart()                                        │  │
│  │  ├─ placeOrder()        ──→ POST /api/grubhub/orders  │  │
│  │  ├─ loadOrderHistory()  ──→ GET /api/grubhub/orders   │  │
│  │  └─ toggleShop()                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Socket.IO Client                                         │  │
│  │ (Real-time notifications)                               │  │
│  │                                                          │  │
│  │  socket.on('grubhub:order-placed', (order) => {...})  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP + WebSocket
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Node.js Server (Backend)                       │
│                  (port 3000)                                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  server.js                                             │   │
│  │                                                        │   │
│  │  Express Routes (GrubHub API):                         │   │
│  │  ├─ GET  /api/grubhub/menu                           │   │
│  │  ├─ POST /api/grubhub/orders                         │   │
│  │  ├─ GET  /api/grubhub/orders/:playerName             │   │
│  │  ├─ GET  /api/grubhub/orders/status/:orderId         │   │
│  │  ├─ POST /api/grubhub/orders/:orderId/cancel         │   │
│  │  └─ GET  /api/grubhub/orders (admin)                 │   │
│  │                                                        │   │
│  │  Data:                                                 │   │
│  │  ├─ menuItems[]  (7 food items)                       │   │
│  │  └─ activeOrders[] (in-memory storage)                │   │
│  │                                                        │   │
│  │  Socket.IO:                                            │   │
│  │  └─ io.emit('grubhub:order-placed', order)            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  In-Memory Database (activeOrders)                     │   │
│  │                                                        │   │
│  │  Orders:                                               │   │
│  │  [{                                                    │   │
│  │    orderId: "ORD-123456-ABC",                         │   │
│  │    playerName: "VR Player",                           │   │
│  │    items: [{name, price, quantity}],                 │   │
│  │    total: 21.97,                                       │   │
│  │    status: "confirmed",                               │   │
│  │    createdAt: "2026-03-18T...",                      │   │
│  │    estimatedDelivery: "2026-03-18T..."              │   │
│  │  }]                                                    │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                  (Future: Connect to real)
                             ↓
                    [Real GrubHub API]
```

## Data Flow Diagram

### Order Placement Flow
```
┌─────────────────────────────────────────────────────────────┐
│  User adds items to cart                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  User clicks "Place Order"                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  grubhubShop.placeOrder() called                            │
│  - Collect items from cart                                  │
│  - Get player name                                          │
│  - Calculate total                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  POST /api/grubhub/orders                                   │
│  {                                                          │
│    items: [{itemId, quantity}],                            │
│    playerName: "Player Name",                              │
│    deliveryAddress: "In-Game Location"                     │
│  }                                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Server receives order                                      │
│  - Validates items against menuItems[]                      │
│  - Calculates total                                         │
│  - Creates order object with ID                            │
│  - Stores in activeOrders[]                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓ (Parallel)
        ┌─────────────┴──────────────┐
        │                            │
        ↓                            ↓
┌──────────────────────┐  ┌──────────────────────┐
│ Broadcast to all     │  │ Send confirmation    │
│ connected players:   │  │ response to client   │
│                      │  │                      │
│ socket.emit(         │  │ {                    │
│ 'order-placed',      │  │   success: true,     │
│ {...order data}      │  │   order: {...},      │
│ )                    │  │   message: "..."     │
│                      │  │ }                    │
└──────────────────────┘  └──────────────────────┘
        │                            │
        ↓                            ↓
   All players see         Order confirmation shown
   announcement            & order ID displayed
   (if listening)         Cart cleared
```

## API Request/Response Examples

### GET /api/grubhub/menu
```
REQUEST:  curl http://localhost:3000/api/grubhub/menu

RESPONSE: {
  "success": true,
  "items": [
    {
      "id": "burger",
      "name": "🍔 Juicy Burger",
      "price": 8.99,
      "description": "Classic burger with toppings"
    },
    {
      "id": "pizza",
      "name": "🍕 Pepperoni Pizza",
      "price": 12.99,
      "description": "Large pepperoni pizza"
    },
    ...
  ]
}
```

### POST /api/grubhub/orders
```
REQUEST:  curl -X POST http://localhost:3000/api/grubhub/orders \
            -H "Content-Type: application/json" \
            -d '{
              "items": [
                {"itemId": "burger", "quantity": 2},
                {"itemId": "fries", "quantity": 1}
              ],
              "playerName": "VR Player",
              "deliveryAddress": "Virtual World"
            }'

RESPONSE: {
  "success": true,
  "message": "Order placed successfully!",
  "order": {
    "orderId": "ORD-1773852562915-ABC123",
    "playerName": "VR Player",
    "items": [
      {
        "id": "burger",
        "name": "🍔 Juicy Burger",
        "price": 8.99,
        "quantity": 2
      },
      {
        "id": "fries",
        "name": "🍟 Crispy Fries",
        "price": 3.99,
        "quantity": 1
      }
    ],
    "total": 21.97,
    "deliveryAddress": "Virtual World",
    "status": "confirmed",
    "createdAt": "2026-03-18T16:49:22.915Z",
    "estimatedDelivery": "2026-03-18T17:19:22.915Z"
  }
}
```

## Feature Breakdown

```
GrubHub Integration Features
│
├─ Frontend UI (grubhub-shop.js)
│  ├─ Shop Toggle Button
│  │  └─ "🍔 Order Food" in bottom-right
│  │
│  ├─ Menu Display
│  │  ├─ Item names with emoji
│  │  ├─ Descriptions
│  │  ├─ Prices
│  │  └─ Quantity selectors
│  │
│  ├─ Shopping Cart
│  │  ├─ Add/remove items
│  │  ├─ Update quantities
│  │  ├─ Calculate subtotals
│  │  ├─ Show total price
│  │  └─ Clear cart button
│  │
│  ├─ Player Identification
│  │  └─ Custom name input
│  │
│  ├─ Order Placement
│  │  ├─ Validation
│  │  ├─ API call
│  │  ├─ Confirmation modal
│  │  └─ Clear cart on success
│  │
│  └─ Order History
│     ├─ Load from API
│     ├─ Display with status
│     └─ Show order details
│
├─ Backend API (server.js)
│  ├─ Menu Management
│  │  ├─ GET /menu (all items)
│  │  └─ GET /menu/:id (specific item)
│  │
│  ├─ Order Management
│  │  ├─ POST /orders (create)
│  │  ├─ GET /orders (all)
│  │  ├─ GET /orders/:playerName (by player)
│  │  ├─ GET /orders/status/:id (tracking)
│  │  └─ POST /orders/:id/cancel (cancellation)
│  │
│  └─ Data Storage
│     ├─ menuItems[] (in-code)
│     └─ activeOrders[] (in-memory)
│
└─ Real-time Features
   ├─ Socket.IO Notifications
   │  └─ 'grubhub:order-placed' event
   │
   └─ Order Broadcasting
      └─ All players notified
```

## Keyboard Shortcuts

When integrated with `grubhub-examples.js`:

| Shortcut | Action |
|----------|--------|
| `Ctrl+O` / `Cmd+O` | Toggle shop |
| `Ctrl+L` / `Cmd+L` | Show leaderboard |
| `Ctrl+S` / `Cmd+S` | Show statistics |

## Files Map

```
project/
├── server.js (140 lines added)
│   └─ GrubHub API endpoints
│
├── package.json (updated)
│   └─ + axios dependency
│
├── public/
│   ├── index.html (updated)
│   │   └─ + grubhub-shop.js script tag
│   │
│   └── js/
│       ├── app.js (unchanged)
│       ├── grubhub-shop.js (NEW - 450+ lines)
│       │   └─ Complete shop UI component
│       │
│       └── grubhub-examples.js (NEW - 350+ lines)
│           └─ Integration examples & helpers
│
└── Documentation/
    ├── GRUBHUB_INTEGRATION.md (NEW)
    │   └─ Complete technical reference
    │
    ├── QUICKSTART.md (NEW)
    │   └─ 5-minute getting started
    │
    └── IMPLEMENTATION_SUMMARY.md (NEW)
        └─ Overview & next steps
```

---

**Your VR game now has food ordering! 🍔🚀**
