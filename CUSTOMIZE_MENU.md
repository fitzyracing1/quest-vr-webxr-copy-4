# 🍔 How to Customize the GrubHub Menu

This guide shows how to easily add, remove, or modify food items in your game.

## Quick Menu Edits

### Location
The menu is defined in `server.js` at the top of the GrubHub section:

```javascript
const menuItems = [
  { id: 'burger', name: '🍔 Juicy Burger', price: 8.99, description: 'Classic burger with toppings' },
  { id: 'pizza', name: '🍕 Pepperoni Pizza', price: 12.99, description: 'Large pepperoni pizza' },
  // ... more items
];
```

## Add a New Item

Open `server.js` and add to the `menuItems` array:

```javascript
const menuItems = [
  // ... existing items ...
  
  // NEW ITEM: Add this line
  { id: 'hotdog', name: '🌭 Hot Dog', price: 5.99, description: 'Delicious hot dog with toppings' },
];
```

**Rules for item properties:**
- `id` - Unique identifier (lowercase, no spaces)
- `name` - Display name with emoji (appears in menu)
- `price` - Cost in dollars
- `description` - Short description (appears in menu)

## Remove an Item

Simply delete the line:

```javascript
const menuItems = [
  { id: 'burger', name: '🍔 Juicy Burger', price: 8.99, description: 'Classic burger with toppings' },
  // DELETE THIS LINE:
  // { id: 'pizza', name: '🍕 Pepperoni Pizza', price: 12.99, description: 'Large pepperoni pizza' },
  { id: 'tacos', name: '🌮 Tacos (3)', price: 9.99, description: 'Delicious street tacos' },
];
```

## Modify Existing Item

Change the properties:

```javascript
// BEFORE:
{ id: 'burger', name: '🍔 Juicy Burger', price: 8.99, description: 'Classic burger with toppings' },

// AFTER (price change):
{ id: 'burger', name: '🍔 Juicy Burger', price: 10.99, description: 'Classic burger with toppings' },

// AFTER (better description):
{ id: 'burger', name: '🍔 Juicy Burger', price: 8.99, description: 'Premium beef patty with lettuce, tomato, and special sauce' },

// AFTER (new emoji):
{ id: 'burger', name: '🥩 Deluxe Burger', price: 8.99, description: 'Classic burger with toppings' },
```

## Example Menus

### Breakfast Menu
```javascript
const menuItems = [
  { id: 'pancakes', name: '🥞 Pancakes', price: 7.99, description: 'Fluffy pancakes with syrup' },
  { id: 'eggs', name: '🍳 Eggs & Bacon', price: 8.99, description: 'Scrambled eggs with crispy bacon' },
  { id: 'toast', name: '🍞 French Toast', price: 6.99, description: 'Golden brown french toast' },
  { id: 'coffee', name: '☕ Coffee', price: 2.99, description: 'Hot fresh coffee' },
  { id: 'juice', name: '🥤 Orange Juice', price: 2.99, description: 'Fresh orange juice' },
];
```

### Healthy Menu
```javascript
const menuItems = [
  { id: 'salad', name: '🥗 Caesar Salad', price: 9.99, description: 'Fresh greens with dressing' },
  { id: 'smoothie', name: '🍓 Berry Smoothie', price: 6.99, description: 'Mixed berry smoothie' },
  { id: 'grilled', name: '🍗 Grilled Chicken', price: 11.99, description: 'Tender grilled chicken breast' },
  { id: 'fish', name: '🐟 Grilled Fish', price: 13.99, description: 'Fresh grilled salmon' },
  { id: 'veggies', name: '🥦 Veggie Bowl', price: 8.99, description: 'Roasted seasonal vegetables' },
];
```

### Dessert Menu
```javascript
const menuItems = [
  { id: 'ice-cream', name: '🍦 Ice Cream', price: 4.99, description: 'Vanilla, chocolate, or strawberry' },
  { id: 'cake', name: '🎂 Chocolate Cake', price: 5.99, description: 'Rich chocolate layer cake' },
  { id: 'cookies', name: '🍪 Cookies', price: 3.99, description: 'Warm chocolate chip cookies' },
  { id: 'brownies', name: '🍫 Brownies', price: 4.99, description: 'Fudgy chocolate brownies' },
  { id: 'pie', name: '🥧 Apple Pie', price: 5.99, description: 'Classic apple pie with vanilla' },
];
```

### International Menu
```javascript
const menuItems = [
  { id: 'ramen', name: '🍜 Ramen', price: 11.99, description: 'Japanese noodle soup' },
  { id: 'curry', name: '🍛 Curry Rice', price: 10.99, description: 'Indian spiced rice' },
  { id: 'burritos', name: '🌯 Burritos', price: 9.99, description: 'Mexican flour tortilla wraps' },
  { id: 'pad-thai', name: '🥘 Pad Thai', price: 10.99, description: 'Thai stir-fried noodles' },
  { id: 'kebab', name: '🍢 Kebab', price: 10.99, description: 'Mediterranean grilled kebab' },
];
```

### Fast Food Menu
```javascript
const menuItems = [
  { id: 'burger', name: '🍔 Burger', price: 5.99, description: 'Classic cheeseburger' },
  { id: 'fries', name: '🍟 Fries', price: 2.99, description: 'Golden crispy fries' },
  { id: 'chicken', name: '🍗 Chicken Tenders', price: 6.99, description: 'Crispy chicken strips' },
  { id: 'hotdog', name: '🌭 Hot Dog', price: 4.99, description: 'Beef hot dog with bun' },
  { id: 'shake', name: '🥤 Milkshake', price: 4.99, description: 'Vanilla, chocolate, or strawberry' },
];
```

## Emoji Codes for Food

Use these emojis in your menu names:

| Emoji | Name | Emoji | Name |
|-------|------|-------|------|
| 🍔 | Burger | 🥪 | Sandwich |
| 🍕 | Pizza | 🌮 | Taco |
| 🌭 | Hot Dog | 🍟 | Fries |
| 🍝 | Pasta | 🍜 | Ramen |
| 🍲 | Soup | 🥘 | Curry |
| 🍱 | Bento Box | 🍛 | Rice Curry |
| 🍣 | Sushi | 🍤 | Shrimp |
| 🍗 | Chicken | 🥩 | Meat |
| 🍖 | Meat on Bone | 🐟 | Fish |
| 🥗 | Salad | 🥙 | Pita |
| 🌯 | Burrito | 🥟 | Dumpling |
| 🍚 | Rice | 🍥 | Fish Cake |
| 🍤 | Shrimp | 🍙 | Rice Ball |
| 🍞 | Bread | 🥐 | Croissant |
| 🥖 | Baguette | 🥨 | Pretzel |
| 🥯 | Bagel | 🧈 | Butter |
| 🥒 | Pickle | 🥬 | Leafy Green |
| 🥦 | Broccoli | 🥒 | Cucumber |
| 🌽 | Corn | 🍅 | Tomato |
| 🍆 | Eggplant | 🥑 | Avocado |
| 🧅 | Onion | 🥕 | Carrot |
| 🌶️ | Chili Pepper | 🍆 | Eggplant |
| 🍎 | Apple | 🍊 | Orange |
| 🍋 | Lemon | 🍌 | Banana |
| 🍉 | Watermelon | 🍇 | Grapes |
| 🍓 | Strawberry | 🫐 | Blueberry |
| 🍒 | Cherries | 🍑 | Peach |
| 🍐 | Pear | 🥝 | Kiwi |
| 🍍 | Pineapple | 🍑 | Peach |
| 🍰 | Cake | 🎂 | Birthday Cake |
| 🧁 | Cupcake | 🍮 | Custard |
| 🍭 | Lollipop | 🍬 | Candy |
| 🍫 | Chocolate | 🍿 | Popcorn |
| 🍦 | Ice Cream | 🍨 | Ice Cream Bowl |
| 🍧 | Shaved Ice | 🥤 | Cup with Straw |
| 🍹 | Tropical Drink | 🍸 | Cocktail |
| ☕ | Coffee | 🍵 | Tea |
| 🥛 | Milk | 🍶 | Sake |
| 🍾 | Wine Bottle | 🍷 | Wine |
| 🍺 | Beer | 🍻 | Clinking Beer |
| 🍫 | Chocolate | 🥊 | Boxing Glove |

## Advanced: Create Menu Variations

### By Time of Day
```javascript
const getMenuByTime = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    // Breakfast menu
    return [
      { id: 'pancakes', name: '🥞 Pancakes', price: 7.99, description: 'Fluffy pancakes' },
      { id: 'eggs', name: '🍳 Eggs', price: 8.99, description: 'Scrambled eggs' },
    ];
  } else if (hour < 17) {
    // Lunch menu
    return [
      { id: 'burger', name: '🍔 Burger', price: 8.99, description: 'Juicy burger' },
      { id: 'salad', name: '🥗 Salad', price: 9.99, description: 'Fresh salad' },
    ];
  } else {
    // Dinner menu
    return [
      { id: 'steak', name: '🥩 Steak', price: 15.99, description: 'Premium steak' },
      { id: 'fish', name: '🐟 Fish', price: 13.99, description: 'Grilled fish' },
    ];
  }
};
```

### By Player Level
```javascript
const getMenuByLevel = (playerLevel) => {
  if (playerLevel < 10) {
    // Beginner - cheap items
    return menuItems.filter(item => item.price < 7);
  } else if (playerLevel < 50) {
    // Intermediate - all items
    return menuItems;
  } else {
    // Advanced - premium items
    return menuItems.filter(item => item.price > 10);
  }
};
```

### Random Special Item
```javascript
const specialItems = [
  { id: 'lobster', name: '🦞 Lobster Tail', price: 24.99, description: 'Premium lobster' },
  { id: 'wagyu', name: '🥩 Wagyu Beef', price: 32.99, description: 'Japanese Wagyu' },
  { id: 'truffle', name: '🍄 Truffle Pasta', price: 18.99, description: 'Pasta with truffle' },
];

const menuWithSpecial = [
  ...menuItems,
  specialItems[Math.floor(Math.random() * specialItems.length)]
];
```

## Tips & Tricks

### ✅ DO's
- ✅ Use emojis for visual appeal
- ✅ Keep descriptions under 50 characters
- ✅ Use realistic prices
- ✅ Have at least 3-4 items
- ✅ Test the menu in-game before deploying

### ❌ DON'Ts
- ❌ Use IDs with spaces or special characters
- ❌ Leave empty descriptions
- ❌ Make prices unrealistic (too high/low)
- ❌ Use duplicate IDs
- ❌ Forget to save `server.js` after editing

## Testing Your Changes

After editing the menu:

1. **Save the file** (Ctrl+S / Cmd+S)
2. **Restart the server**:
   ```bash
   npm start
   ```
3. **Test the menu endpoint**:
   ```bash
   curl http://localhost:3000/api/grubhub/menu
   ```
4. **Open in browser** and check the "📋 Menu" section in the shop

## Common Customizations

### Lower all prices by 20%
```javascript
const menuItems = [
  { id: 'burger', name: '🍔 Juicy Burger', price: 7.19, description: '...' }, // was 8.99
  { id: 'pizza', name: '🍕 Pepperoni Pizza', price: 10.39, description: '...' }, // was 12.99
  // ... multiply all prices by 0.8
];
```

### Add VIP item available only to certain players
```javascript
// In server.js POST /orders endpoint:
if (isVIPPlayer(playerName)) {
  menuItems.push({ 
    id: 'vip-meal', 
    name: '👑 VIP Meal', 
    price: 19.99, 
    description: 'Exclusive VIP meal' 
  });
}
```

### Create seasonal menu
```javascript
const month = new Date().getMonth();
if (month === 11) { // December
  // Add holiday items
  menuItems.push({ 
    id: 'holiday-special', 
    name: '🎄 Holiday Special', 
    price: 15.99, 
    description: 'Festive holiday meal' 
  });
}
```

---

**Have fun creating your menu! 🍔🎨**
