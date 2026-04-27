// GrubHub Shop UI Module for VR Game

class GrubHubShop {
  constructor() {
    this.isOpen = false;
    this.cart = [];
    this.menuItems = [];
    this.currentOrder = null;
    this.playerName = 'VR Player';
    this.init();
  }

  async init() {
    // Create shop UI
    this.createShopUI();
    // Load menu items from server
    await this.loadMenu();
    // Setup event listeners
    this.setupListeners();
  }

  createShopUI() {
    // Main shop container
    const shopContainer = document.createElement('div');
    shopContainer.id = 'grubhub-shop';
    shopContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Shop toggle button
    const shopButton = document.createElement('button');
    shopButton.id = 'grubhub-toggle';
    shopButton.innerHTML = '🍔 Order Food';
    shopButton.style.cssText = `
      padding: 12px 16px;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      transition: all 0.3s ease;
    `;
    shopButton.addEventListener('mouseover', () => {
      shopButton.style.transform = 'scale(1.05)';
      shopButton.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
    });
    shopButton.addEventListener('mouseout', () => {
      shopButton.style.transform = 'scale(1)';
      shopButton.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
    });
    shopButton.addEventListener('click', () => this.toggleShop());

    // Shop panel (hidden by default)
    const shopPanel = document.createElement('div');
    shopPanel.id = 'grubhub-panel';
    shopPanel.style.cssText = `
      display: none;
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 400px;
      max-height: 600px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      padding: 20px;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    `;

    shopPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #FF6B35;">
        <h2 style="margin: 0; color: #333;">🍔 GrubHub Shop</h2>
        <button id="grubhub-close" style="background: none; border: none; font-size: 24px; cursor: pointer;">✕</button>
      </div>

      <div id="grubhub-player-name" style="margin-bottom: 15px;">
        <label style="display: block; font-weight: bold; margin-bottom: 5px;">Player Name:</label>
        <input type="text" id="player-name-input" placeholder="Enter your name" value="VR Player" 
          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #333; margin: 10px 0;">📋 Menu</h3>
        <div id="grubhub-menu" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px; padding: 10px;">
          <!-- Menu items populated by JS -->
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #333; margin: 10px 0;">🛒 Cart</h3>
        <div id="grubhub-cart" style="max-height: 150px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px; padding: 10px; min-height: 40px;">
          <p style="color: #999; margin: 0;">Cart is empty</p>
        </div>
      </div>

      <div id="grubhub-total" style="font-size: 18px; font-weight: bold; color: #FF6B35; margin-bottom: 15px;">
        Total: $0.00
      </div>

      <div id="grubhub-orders" style="margin-bottom: 15px;">
        <h3 style="color: #333; margin: 10px 0;">📦 Your Orders</h3>
        <div id="grubhub-order-history" style="max-height: 150px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px; padding: 10px; font-size: 12px;">
          <p style="color: #999; margin: 0;">No orders yet</p>
        </div>
      </div>

      <button id="grubhub-checkout" style="width: 100%; padding: 12px; background: #FF6B35; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">
        ✓ Place Order
      </button>
      <button id="grubhub-clear-cart" style="width: 100%; padding: 12px; background: #ddd; color: #333; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
        Clear Cart
      </button>
    `;

    shopContainer.appendChild(shopButton);
    shopContainer.appendChild(shopPanel);
    document.body.appendChild(shopContainer);

    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      #grubhub-panel {
        animation: slideUp 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  async loadMenu() {
    try {
      const response = await fetch('/api/grubhub/menu');
      const data = await response.json();
      
      if (data.success) {
        this.menuItems = data.items;
        this.renderMenu();
      }
    } catch (error) {
      console.error('Failed to load menu:', error);
      alert('Failed to load GrubHub menu');
    }
  }

  renderMenu() {
    const menuDiv = document.getElementById('grubhub-menu');
    menuDiv.innerHTML = '';

    this.menuItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.style.cssText = `
        padding: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      itemDiv.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small style="color: #666;">${item.description}</small><br>
          <strong style="color: #FF6B35;">$${item.price.toFixed(2)}</strong>
        </div>
        <input type="number" min="0" max="99" value="0" data-item-id="${item.id}" 
          class="menu-item-qty" style="width: 50px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
      `;
      menuDiv.appendChild(itemDiv);
    });
  }

  setupListeners() {
    // Close button
    document.getElementById('grubhub-close').addEventListener('click', () => this.toggleShop());

    // Menu item quantity changes
    document.getElementById('grubhub-menu').addEventListener('change', (e) => {
      if (e.target.classList.contains('menu-item-qty')) {
        this.updateCart();
      }
    });

    // Checkout button
    document.getElementById('grubhub-checkout').addEventListener('click', () => this.placeOrder());

    // Clear cart button
    document.getElementById('grubhub-clear-cart').addEventListener('click', () => {
      document.querySelectorAll('.menu-item-qty').forEach(input => input.value = '0');
      this.updateCart();
    });

    // Player name input
    document.getElementById('player-name-input').addEventListener('change', (e) => {
      this.playerName = e.target.value || 'VR Player';
    });
  }

  updateCart() {
    this.cart = [];
    let total = 0;

    document.querySelectorAll('.menu-item-qty').forEach(input => {
      const qty = parseInt(input.value) || 0;
      if (qty > 0) {
        const itemId = input.getAttribute('data-item-id');
        const menuItem = this.menuItems.find(m => m.id === itemId);
        if (menuItem) {
          this.cart.push({
            itemId: itemId,
            quantity: qty,
            name: menuItem.name,
            price: menuItem.price,
            subtotal: menuItem.price * qty
          });
          total += menuItem.price * qty;
        }
      }
    });

    this.renderCart();
    document.getElementById('grubhub-total').textContent = `Total: $${total.toFixed(2)}`;
  }

  renderCart() {
    const cartDiv = document.getElementById('grubhub-cart');
    
    if (this.cart.length === 0) {
      cartDiv.innerHTML = '<p style="color: #999; margin: 0;">Cart is empty</p>';
      return;
    }

    cartDiv.innerHTML = '';
    this.cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.style.cssText = `
        padding: 8px 0;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
      `;
      itemDiv.innerHTML = `
        <span>${item.quantity}x ${item.name}</span>
        <strong>$${item.subtotal.toFixed(2)}</strong>
      `;
      cartDiv.appendChild(itemDiv);
    });
  }

  async placeOrder() {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch('/api/grubhub/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: this.cart.map(item => ({ itemId: item.itemId, quantity: item.quantity })),
          playerName: this.playerName,
          deliveryAddress: 'In-Game Location'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        this.currentOrder = data.order;
        this.showOrderConfirmation(data.order);
        
        // Clear cart
        document.querySelectorAll('.menu-item-qty').forEach(input => input.value = '0');
        this.updateCart();
        
        // Load order history
        this.loadOrderHistory();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order');
    }
  }

  async loadOrderHistory() {
    try {
      const response = await fetch(`/api/grubhub/orders/${encodeURIComponent(this.playerName)}`);
      const data = await response.json();
      
      if (data.success && data.orders.length > 0) {
        this.renderOrderHistory(data.orders);
      }
    } catch (error) {
      console.error('Failed to load order history:', error);
    }
  }

  renderOrderHistory(orders) {
    const historyDiv = document.getElementById('grubhub-order-history');
    historyDiv.innerHTML = '';

    orders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.style.cssText = `
        padding: 8px;
        border-bottom: 1px solid #eee;
        margin-bottom: 5px;
        border-radius: 4px;
        background: ${order.status === 'cancelled' ? '#fee' : '#efe'};
      `;
      const itemsList = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
      orderDiv.innerHTML = `
        <strong>${order.orderId}</strong> - $${order.total.toFixed(2)}<br>
        <small>${itemsList}</small><br>
        <small style="color: #666;">Status: ${order.status}</small>
      `;
      historyDiv.appendChild(orderDiv);
    });
  }

  showOrderConfirmation(order) {
    const itemsList = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    alert(`
      ✓ Order Placed Successfully!
      
      Order ID: ${order.orderId}
      Items: ${itemsList}
      Total: $${order.total.toFixed(2)}
      
      Estimated Delivery: 30 minutes
      
      Your food is on the way! 🍔🚚
    `);
  }

  toggleShop() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('grubhub-panel');
    panel.style.display = this.isOpen ? 'block' : 'none';
    
    if (this.isOpen) {
      this.loadOrderHistory();
    }
  }
}

// Initialize GrubHub shop when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.grubhubShop = new GrubHubShop();
});
