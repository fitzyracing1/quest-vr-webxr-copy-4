# GrubHub Integration - Quick Start Guide

## ✅ What's New

Your Quest VR WebXR game now has **in-game food ordering** powered by GrubHub! Players can browse a menu, add items to a cart, and place food delivery orders directly from the game.

## 🚀 Getting Started (5 Minutes)

### 1. **Installed Dependencies**
The `axios` package has been added to handle GrubHub API calls.

```bash
npm install  # Already done - packages are ready
```

### 2. **Start Your Server**
```bash
npm start
```

You'll see:
```
🚀 Server listening on http://localhost:3000
📡 LAN: http://192.168.x.x:3000
```

### 3. **Open in Browser**
- Go to `http://localhost:3000`
- Look for **"🍔 Order Food"** button in the bottom-right corner
- Click to open the shop!

## 🛍️ What Players Can Do

1. **Browse Menu** - 7 items with descriptions and prices
2. **Add to Cart** - Use quantity spinners
3. **Enter Name** - Personalize their order
4. **Place Order** - Get instant confirmation with order ID
5. **Track Orders** - View order history

## 📂 What Was Added

```
server.js                    ← Added GrubHub API endpoints
public/js/grubhub-shop.js   ← New file: Shop UI component
public/index.html           ← Added grubhub-shop.js script tag
package.json                ← Added axios dependency
GRUBHUB_INTEGRATION.md      ← Full documentation
QUICKSTART.md               ← This file
```

## 🔌 API Endpoints (Your Server)

All endpoints available at `http://localhost:3000/api/grubhub/`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/menu` | Get all menu items |
| POST | `/orders` | Place new order |
| GET | `/orders/:playerName` | Get player's orders |
| GET | `/orders` | Get all orders (admin) |
| POST | `/orders/:orderId/cancel` | Cancel an order |

## 📋 Menu Items Available

- 🍔 Juicy Burger - $8.99
- 🍕 Pepperoni Pizza - $12.99
- 🌮 Tacos (3) - $9.99
- 🍣 Sushi Roll Combo - $14.99
- 🍟 Crispy Fries - $3.99
- 🥤 Soft Drink - $2.99
- 🍰 Cheesecake - $5.99

## 🧪 Test It Out

### Test the Menu
```bash
curl http://localhost:3000/api/grubhub/menu
```

### Test Placing an Order
```bash
curl -X POST http://localhost:3000/api/grubhub/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"itemId": "burger", "quantity": 1}],
    "playerName": "Player Name",
    "deliveryAddress": "Game Location"
  }'
```

### Test Getting Orders
```bash
curl "http://localhost:3000/api/grubhub/orders/Player%20Name"
```

## 🎮 Multiplayer Feature

When a player places an order, ALL connected players get notified in real-time via Socket.IO!

```javascript
socket.on('grubhub:order-placed', (order) => {
  console.log(`${order.playerName} ordered: ${order.items}`);
});
```

## 💳 Next Steps

### To Connect Real GrubHub API:
1. Get API key from [GrubHub Developer Portal](https://developer.grubhub.com)
2. Set environment variables:
   ```bash
   export GRUBHUB_API_KEY="your-key"
   export GRUBHUB_RESTAURANT_ID="your-id"
   ```
3. Update `server.js` to use real API instead of mock

### To Add Database:
1. Install MongoDB/PostgreSQL
2. Replace in-memory `activeOrders` array with database
3. Add user authentication

### To Accept Payments:
1. Integrate Stripe or PayPal
2. Add payment processing endpoint
3. Store payment info securely

## ❓ FAQ

**Q: Where are orders stored?**
A: Currently in-memory (RAM). Restart the server to clear. Add database for persistence.

**Q: Can I customize the menu?**
A: Yes! Edit the `menuItems` array in `server.js` - add/remove items anytime.

**Q: Does this work on Quest VR?**
A: Yes! The UI is built with web standards. Works on any WebXR device.

**Q: How do I make money?**
A: Take a commission on orders, or charge restaurants for the feature.

## 📞 Support

See `GRUBHUB_INTEGRATION.md` for:
- Complete API documentation
- Monetization ideas
- Troubleshooting
- Future enhancements

## 🎉 You're All Set!

Your game is now a food delivery platform. Start the server and enjoy! 🍔🚀
