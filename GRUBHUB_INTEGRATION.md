# GrubHub Integration for Quest VR Game

Your VR game now includes GrubHub food ordering! Players can browse a menu, add items to their cart, and place real food delivery orders directly from within the game.

## Features

✅ **In-Game Food Menu** - 7 delicious menu items with descriptions and prices
✅ **Shopping Cart System** - Add/remove items with quantity control
✅ **Order Placement** - Place orders with player customization
✅ **Order Tracking** - View order status and history
✅ **Multiplayer Notifications** - All players see when orders are placed
✅ **Mock API** - Works out of the box without external API keys

## Quick Start

### 1. Start the Server
```bash
npm start
```

The GrubHub API will be available at `http://localhost:3000/api/grubhub/`

### 2. In Your Browser
- Open `http://localhost:3000` in your Quest browser
- Look for the **"🍔 Order Food"** button in the bottom-right corner
- Click it to open the GrubHub shop

## How It Works

### Frontend (grubhub-shop.js)
The GrubHub shop UI provides:
- **Menu Display** - Browse all available items with prices
- **Shopping Cart** - Add quantities and manage items
- **Player Identification** - Enter your name for orders
- **Order Confirmation** - Get order ID and delivery estimate
- **Order History** - View your past orders

### Backend API Endpoints

#### Get Menu
```
GET /api/grubhub/menu
Response: { success: true, items: [...] }
```

#### Place Order
```
POST /api/grubhub/orders
Body: {
  items: [{ itemId: "burger", quantity: 2 }, ...],
  playerName: "VR Player",
  deliveryAddress: "In-Game Location"
}
Response: { success: true, order: {...}, message: "Order placed successfully!" }
```

#### Get Player Orders
```
GET /api/grubhub/orders/:playerName
Response: { success: true, orders: [...] }
```

#### Get Order Status
```
GET /api/grubhub/orders/status/:orderId
Response: { success: true, order: {...} }
```

#### Cancel Order
```
POST /api/grubhub/orders/:orderId/cancel
Response: { success: true, order: {...} }
```

#### Get All Orders (Admin)
```
GET /api/grubhub/orders
Response: { success: true, orders: [...] }
```

## Menu Items

The default menu includes:
- 🍔 Juicy Burger - $8.99
- 🍕 Pepperoni Pizza - $12.99
- 🌮 Tacos (3) - $9.99
- 🍣 Sushi Roll Combo - $14.99
- 🍟 Crispy Fries - $3.99
- 🥤 Soft Drink - $2.99
- 🍰 Cheesecake - $5.99

## Real GrubHub Integration

To connect to the real GrubHub API:

1. **Get API Credentials**
   - Sign up at [GrubHub Developer Portal](https://developer.grubhub.com)
   - Get your `API_KEY` and `RESTAURANT_ID`

2. **Set Environment Variables**
   ```bash
   export GRUBHUB_API_KEY="your-api-key"
   export GRUBHUB_RESTAURANT_ID="your-restaurant-id"
   ```

3. **Update server.js** to call real GrubHub API instead of mock:
   ```javascript
   // Replace the mock order logic with actual API calls
   // Example using axios:
   const response = await axios.post(
     'https://api.grubhub.com/orders',
     { /* order data */ },
     { headers: { 'Authorization': `Bearer ${grubhubConfig.apiKey}` } }
   );
   ```

## Monetization Ideas

1. **In-Game Currency** - Players earn virtual coins to buy real food
2. **Premium Menu** - Special items for VR Plus members
3. **Combo Deals** - Discounted bundles for frequent orders
4. **Leaderboards** - Most orders placed, highest spender, etc.
5. **Achievements** - Unlock food items by completing game challenges

## Socket.IO Integration

When an order is placed, all connected players are notified:
```javascript
io.emit('grubhub:order-placed', {
  playerName: "VR Player",
  items: "2x Burger, 1x Fries",
  total: 21.97
});
```

Listen for orders in your app.js:
```javascript
socket.on('grubhub:order-placed', (order) => {
  console.log(`${order.playerName} ordered: ${order.items} for $${order.total}`);
});
```

## Testing

### Test Order Placement
```bash
curl -X POST http://localhost:3000/api/grubhub/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"itemId": "burger", "quantity": 2}],
    "playerName": "Test Player",
    "deliveryAddress": "VR World"
  }'
```

### View All Orders
```bash
curl http://localhost:3000/api/grubhub/orders
```

### Get Player Orders
```bash
curl "http://localhost:3000/api/grubhub/orders/Test%20Player"
```

## Troubleshooting

**Shop button not showing?**
- Make sure `grubhub-shop.js` is loaded in your HTML
- Check browser console for errors

**Orders not saving?**
- Orders are stored in-memory; they reset when the server restarts
- Add database persistence for production use

**Menu not loading?**
- Ensure the server is running on port 3000
- Check network tab in browser DevTools

## Future Enhancements

- 💾 Database persistence (MongoDB/PostgreSQL)
- 🔐 User authentication
- 💳 Payment integration (Stripe/PayPal)
- 📍 Real location-based delivery
- 🎮 Gamified ordering (achievements, rewards)
- 🌍 Multi-language support
- 📱 Mobile app sync
- 🍽️ Custom restaurant integration

## Dependencies

- `axios` - HTTP client for API calls
- `express` - Web framework
- `socket.io` - Real-time messaging

## License

MIT - Feel free to modify and use in your project!
