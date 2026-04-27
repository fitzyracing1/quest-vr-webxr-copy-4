const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

let clients = 0;
let blocks = [];
let generatedChunks = new Set(); // Track which chunks have been generated

// Initialize with hidden Easter egg blocks
const easterEggs = [
  { id: 'egg-0', pos: { x: -5, y: 3, z: -10 }, color: '#FFD700', isEgg: true, name: 'Gold Cube' },
  { id: 'egg-1', pos: { x: 8, y: 2, z: 5 }, color: '#FF1493', isEgg: true, name: 'Pink Star' },
  { id: 'egg-2', pos: { x: 0, y: 5, z: -15 }, color: '#00FFFF', isEgg: true, name: 'Cyan Mystery' },
  { id: 'egg-3', pos: { x: 12, y: 1, z: -8 }, color: '#00FF00', isEgg: true, name: 'Green Secret' },
  { id: 'egg-4', pos: { x: -10, y: 4, z: 10 }, color: '#FF6347', isEgg: true, name: 'Red Treasure' },
];

blocks = [...easterEggs];

// Procedural chunk generation
function generateChunk(chunkX, chunkZ) {
  const key = `${chunkX},${chunkZ}`;
  if (generatedChunks.has(key)) return [];

  generatedChunks.add(key);
  const chunkBlocks = [];
  const chunkSize = 20; // 20x20 blocks per chunk
  const baseX = chunkX * chunkSize;
  const baseZ = chunkZ * chunkSize;
  
  // Create a procedural landscape using Perlin-like noise (deterministic hash)
  for (let dx = 0; dx < 4; dx++) {
    for (let dz = 0; dz < 4; dz++) {
      const x = baseX + dx * 5;
      const z = baseZ + dz * 5;
      const seed = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
      const height = Math.floor((seed % 1) * 4) + 1;
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
      
      for (let y = 0; y < height; y++) {
        const blockId = `chunk-${chunkX}-${chunkZ}-${dx}-${dz}-${y}`;
        chunkBlocks.push({
          id: blockId,
          pos: { x, y, z },
          color: colors[Math.floor((seed * 10) % colors.length)],
          isChunk: true
        });
      }
    }
  }
  
  return chunkBlocks;
}

io.on('connection', (socket) => {
  clients++;
  io.emit('presence', { clients });
  
  // Send initial world state to new client
  socket.emit('blocks-init', blocks);
  
  // Handle player position updates for chunking
  socket.on('player-moved', (data) => {
    const playerX = data.pos.x;
    const playerZ = data.pos.z;
    const chunkSize = 20;
    const chunkRadius = 2; // Generate chunks 2 chunks away
    
    // Determine which chunk the player is in
    const chunkX = Math.floor(playerX / chunkSize);
    const chunkZ = Math.floor(playerZ / chunkSize);
    
    // Generate chunks around player
    for (let cx = chunkX - chunkRadius; cx <= chunkX + chunkRadius; cx++) {
      for (let cz = chunkZ - chunkRadius; cz <= chunkZ + chunkRadius; cz++) {
        const newBlocks = generateChunk(cx, cz);
        if (newBlocks.length > 0) {
          blocks.push(...newBlocks);
          io.emit('chunk-generated', { blocks: newBlocks, chunkX: cx, chunkZ: cz });
        }
      }
    }
  });
  
  // Handle block placement
  socket.on('place-block', (block) => {
    blocks.push(block);
    io.emit('block-added', block);
  });
  
  // Handle block removal
  socket.on('remove-block', (data) => {
    blocks = blocks.filter(b => b.id !== data.id);
    io.emit('block-removed', data);
  });
  
  // Handle Easter egg discovery
  socket.on('discover-egg', (data) => {
    io.emit('egg-found', { eggId: data.id, playerMessage: `Found: ${data.name}!` });
  });
  
  // Handle scan activation
  socket.on('scan-activated', (data) => {
    io.emit('world-scan', { activatedBy: data.playerId });
  });
  
  socket.on('disconnect', () => {
    clients = Math.max(0, clients - 1);
    io.emit('presence', { clients });
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    clients,
    blocks: blocks.length,
    chunks: generatedChunks.size,
    eggs: easterEggs.length,
    uptime: process.uptime(),
    host: os.hostname()
  });
});

// ============ GRUBHUB INTEGRATION ============

// GrubHub API Mock Store - In production, connect to real GrubHub API
const grubhubConfig = {
  apiKey: process.env.GRUBHUB_API_KEY || 'your-api-key-here',
  restaurantId: process.env.GRUBHUB_RESTAURANT_ID || 'demo-restaurant'
};

// Mock menu items available in the game
const menuItems = [
  { id: 'burger', name: '🍔 Juicy Burger', price: 8.99, description: 'Classic burger with toppings' },
  { id: 'pizza', name: '🍕 Pepperoni Pizza', price: 12.99, description: 'Large pepperoni pizza' },
  { id: 'tacos', name: '🌮 Tacos (3)', price: 9.99, description: 'Delicious street tacos' },
  { id: 'sushi', name: '🍣 Sushi Roll Combo', price: 14.99, description: 'Fresh assorted rolls' },
  { id: 'fries', name: '🍟 Crispy Fries', price: 3.99, description: 'Golden crispy fries' },
  { id: 'drink', name: '🥤 Soft Drink', price: 2.99, description: 'Cold beverage' },
  { id: 'dessert', name: '🍰 Cheesecake', price: 5.99, description: 'Delicious cheesecake' },
];

// Store active orders
let activeOrders = [];

// GET menu items
app.get('/api/grubhub/menu', (req, res) => {
  res.json({ success: true, items: menuItems });
});

// GET specific menu item
app.get('/api/grubhub/menu/:itemId', (req, res) => {
  const item = menuItems.find(m => m.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  res.json({ success: true, item });
});

// POST create order
app.post('/api/grubhub/orders', async (req, res) => {
  try {
    const { items, playerName, deliveryAddress } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Validate items and calculate total
    let total = 0;
    const validatedItems = [];
    
    for (const orderItem of items) {
      const menuItem = menuItems.find(m => m.id === orderItem.itemId);
      if (!menuItem) {
        return res.status(400).json({ success: false, message: `Item ${orderItem.itemId} not found` });
      }
      validatedItems.push({
        ...menuItem,
        quantity: orderItem.quantity || 1
      });
      total += menuItem.price * (orderItem.quantity || 1);
    }

    // Create order object
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const order = {
      orderId,
      playerName: playerName || 'VR Player',
      items: validatedItems,
      total: parseFloat(total.toFixed(2)),
      deliveryAddress: deliveryAddress || 'In-Game Location',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString() // 30 min estimate
    };

    activeOrders.push(order);
    
    // Broadcast order to all connected clients
    io.emit('grubhub:order-placed', {
      playerName: order.playerName,
      items: validatedItems.map(i => `${i.quantity}x ${i.name}`).join(', '),
      total: order.total
    });

    res.json({ 
      success: true, 
      message: 'Order placed successfully!',
      order 
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
});

// GET orders by player
app.get('/api/grubhub/orders/:playerName', (req, res) => {
  const playerOrders = activeOrders.filter(o => o.playerName === decodeURIComponent(req.params.playerName));
  res.json({ success: true, orders: playerOrders });
});

// GET specific order
app.get('/api/grubhub/orders/status/:orderId', (req, res) => {
  const order = activeOrders.find(o => o.orderId === req.params.orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// POST cancel order
app.post('/api/grubhub/orders/:orderId/cancel', (req, res) => {
  const orderIndex = activeOrders.findIndex(o => o.orderId === req.params.orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  
  const order = activeOrders[orderIndex];
  order.status = 'cancelled';
  
  res.json({ success: true, message: 'Order cancelled', order });
});

// GET all active orders (admin)
app.get('/api/grubhub/orders', (req, res) => {
  res.json({ success: true, orders: activeOrders });
});

// ============ END GRUBHUB INTEGRATION ============

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  const addrs = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        addrs.push(net.address);
      }
    }
  }
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  if (addrs.length) {
    for (const ip of addrs) {
      console.log(`📡 LAN: http://${ip}:${PORT}`);
    }
  }
  console.log(`🥚 Easter eggs hidden: ${easterEggs.length}`);
  console.log(`🌍 Procedural world generation enabled`);
});
