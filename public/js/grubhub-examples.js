// Example: How to integrate GrubHub shop with your VR game
// Add this to your app.js if you want additional functionality

// ===== EXAMPLE 1: Listen for orders placed in your game =====
socket.on('grubhub:order-placed', (order) => {
  console.log(`🍔 ${order.playerName} ordered: ${order.items} for $${order.total}`);
  
  // You could trigger a celebration in VR:
  // - Play a sound effect
  // - Show floating text above players
  // - Give players rewards
  // - Update a leaderboard
});

// ===== EXAMPLE 2: Add food rewards for game achievements =====
function triggerFoodReward(achievement) {
  const rewardMap = {
    'found-easter-egg': { itemId: 'burger', quantity: 1, discount: 0.25 },
    'built-100-blocks': { itemId: 'pizza', quantity: 1, discount: 0.50 },
    'defeated-boss': { itemId: 'sushi', quantity: 2, discount: 0.75 }
  };
  
  if (rewardMap[achievement]) {
    const reward = rewardMap[achievement];
    console.log(`You earned a ${(reward.discount * 100)}% discount on ${reward.itemId}!`);
    // Apply discount in grubhubShop
  }
}

// ===== EXAMPLE 3: Log all player orders to console =====
async function logAllOrders() {
  try {
    const response = await fetch('/api/grubhub/orders');
    const data = await response.json();
    console.table(data.orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
}

// ===== EXAMPLE 4: Create a leaderboard =====
async function createOrderLeaderboard() {
  try {
    const response = await fetch('/api/grubhub/orders');
    const data = await response.json();
    
    // Group orders by player
    const playerStats = {};
    data.orders.forEach(order => {
      if (!playerStats[order.playerName]) {
        playerStats[order.playerName] = { count: 0, total: 0 };
      }
      playerStats[order.playerName].count++;
      playerStats[order.playerName].total += order.total;
    });
    
    // Sort by total spent
    const leaderboard = Object.entries(playerStats)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, stats], index) => ({
        rank: index + 1,
        name,
        orders: stats.count,
        totalSpent: stats.total.toFixed(2)
      }));
    
    console.log('🏆 Food Ordering Leaderboard:');
    console.table(leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('Failed to create leaderboard:', error);
  }
}

// ===== EXAMPLE 5: In-game announcement system =====
function announceOrder(order) {
  const message = `
    🎉 New Order Alert!
    ${order.playerName} ordered: ${order.items}
    Total: $${order.total}
    Delivery in ~30 minutes 🚚
  `;
  
  // You could:
  // - Display as 3D text in VR
  // - Play announcement sound
  // - Add to in-game news feed
  console.log(message);
}

// ===== EXAMPLE 6: Add custom menu items dynamically =====
// (You'd need to update server.js to support this)
async function addCustomMenuItem(name, price, emoji = '🍕') {
  // This would require a new POST endpoint on the server
  const newItem = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: `${emoji} ${name}`,
    price: price,
    description: 'Custom item'
  };
  
  console.log('Would add:', newItem);
  // POST /api/grubhub/menu/add endpoint needed
}

// ===== EXAMPLE 7: Order history display on HUD =====
async function displayOrderHistory(playerName) {
  try {
    const response = await fetch(`/api/grubhub/orders/${encodeURIComponent(playerName)}`);
    const data = await response.json();
    
    const historyHtml = data.orders.map(order => `
      <div class="order-item">
        <strong>${order.orderId}</strong> - $${order.total}
        <small>${order.status}</small>
      </div>
    `).join('');
    
    // Could add to HUD or status panel
    return historyHtml;
  } catch (error) {
    console.error('Failed to load order history:', error);
  }
}

// ===== EXAMPLE 8: Monitor server for new orders (polling) =====
function monitorOrdersRealtime(intervalMs = 5000) {
  setInterval(async () => {
    try {
      const response = await fetch('/api/grubhub/orders');
      const data = await response.json();
      
      console.log(`📊 Current Orders: ${data.orders.length}`);
      console.log(`💰 Total Revenue: $${data.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`);
      
    } catch (error) {
      console.error('Monitoring error:', error);
    }
  }, intervalMs);
}

// ===== EXAMPLE 9: Create a HUD widget for current order =====
function createOrderTrackingWidget() {
  const widget = document.createElement('div');
  widget.id = 'order-tracker';
  widget.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 15px;
    border-radius: 8px;
    font-size: 12px;
    max-width: 300px;
    z-index: 99;
  `;
  
  widget.innerHTML = `
    <div><strong>📦 Recent Orders</strong></div>
    <div id="order-list"></div>
  `;
  
  document.body.appendChild(widget);
  return widget;
}

// ===== EXAMPLE 10: Quick order shortcuts =====
const quickOrders = {
  'lunch': [
    { itemId: 'burger', quantity: 1 },
    { itemId: 'fries', quantity: 1 },
    { itemId: 'drink', quantity: 1 }
  ],
  'dinner': [
    { itemId: 'pizza', quantity: 2 },
    { itemId: 'drink', quantity: 2 }
  ],
  'snack': [
    { itemId: 'fries', quantity: 1 },
    { itemId: 'drink', quantity: 1 }
  ]
};

async function placeQuickOrder(preset, playerName) {
  if (!quickOrders[preset]) {
    console.error('Unknown preset:', preset);
    return;
  }
  
  try {
    const response = await fetch('/api/grubhub/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: quickOrders[preset],
        playerName: playerName,
        deliveryAddress: 'In-Game Location'
      })
    });
    
    const data = await response.json();
    console.log(`✓ Quick order "${preset}" placed!`, data.order);
    return data.order;
  } catch (error) {
    console.error('Failed to place quick order:', error);
  }
}

// ===== EXAMPLE 11: Statistics dashboard =====
async function generateOrderStatistics() {
  try {
    const response = await fetch('/api/grubhub/orders');
    const data = await response.json();
    const orders = data.orders.filter(o => o.status !== 'cancelled');
    
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
      averageOrderValue: (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2),
      mostPopularItem: getMostPopularItem(orders),
      topSpender: getTopSpender(orders),
      ordersThisHour: getOrdersInTimeRange(orders, 60)
    };
    
    return stats;
  } catch (error) {
    console.error('Failed to generate statistics:', error);
  }
}

function getMostPopularItem(orders) {
  const itemCounts = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });
  return Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function getTopSpender(orders) {
  const spenders = {};
  orders.forEach(order => {
    spenders[order.playerName] = (spenders[order.playerName] || 0) + order.total;
  });
  const topSpender = Object.entries(spenders).sort((a, b) => b[1] - a[1])[0];
  return topSpender ? { name: topSpender[0], total: topSpender[1].toFixed(2) } : null;
}

function getOrdersInTimeRange(orders, minutes) {
  const cutoff = Date.now() - (minutes * 60000);
  return orders.filter(o => new Date(o.createdAt).getTime() > cutoff).length;
}

// ===== KEYBOARD SHORTCUTS (Optional) =====
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'o':
        e.preventDefault();
        window.grubhubShop?.toggleShop();
        break;
      case 'l':
        e.preventDefault();
        createOrderLeaderboard();
        break;
      case 's':
        e.preventDefault();
        generateOrderStatistics().then(stats => console.table(stats));
        break;
    }
  }
});

console.log('🍔 GrubHub Shop Examples loaded!');
console.log('Try these in the console:');
console.log('  - logAllOrders()');
console.log('  - createOrderLeaderboard()');
console.log('  - generateOrderStatistics()');
console.log('  - placeQuickOrder("lunch", "Player Name")');
console.log('  - monitorOrdersRealtime()');
