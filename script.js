const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 3999,
        rating: 4.5,
        image: "images/wbh.jpg"
    },
    {
        id: 2,
        name: "Men's Casual T-Shirt",
        category: "Clothing",
        price: 1249,
        rating: 4.2,
        image: "images/tshirt.jpg"
    },
    {
        id: 3,
        name: "Stainless Steel Water Bottle",
        category: "Home & Kitchen",
        price: 999,
        rating: 4.7,
        image: "images/st-wb.jpg"
    },
    {
        id: 4,
        name: "Smartphone Fast Charger",
        category: "Electronics",
        price: 1499,
        rating: 4.0,
        image: "images/chrg.jpg"
    },
    {
        id: 5,
        name: "Yoga Mat",
        category: "Sports",
        price: 1999,
        rating: 4.8,
        image: "images/y-mat.jpg"
    },
    {
        id: 6,
        name: "LED Desk Lamp",
        category: "Home & Kitchen",
        price: 1749,
        rating: 3.9,
        image: "images/LED-lmp.jpg"
    },
    {
        id: 7,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 1249,
        rating: 4.3,
        image: "images/w-mouse.jpg"
    },
    {
        id: 8,
        name: "Women's Running Shoes",
        category: "Clothing",
        price: 4499,
        rating: 4.6,
        image: "images/w-run-shoes.jpg"
    },
    {
        id: 9,
        name: "Portable Bluetooth Speaker",
        category: "Electronics",
        price: 2999,
        rating: 4.4,
        image: "images/bt-spkr.jpg"
    },
    {
        id: 10,
        name: "Non-Stick Cooking Pan",
        category: "Home & Kitchen",
        price: 2149,
        rating: 4.1,
        image: "images/non-Tick.jpg"
    },
    {
        id: 11,
        name: "Fitness Tracker Watch",
        category: "Sports",
        price: 4999,
        rating: 4.7,
        image: "images/watch.jpg"
    },
    {
        id: 12,
        name: "Men's Denim Jeans",
        category: "Clothing",
        price: 2499,
        rating: 4.2,
        image: "images/jeans.jpg"
    }
];

const productsGrid = document.getElementById('productsGrid');
const productsCount = document.getElementById('productsCount');
const categoryFilters = document.getElementById('categoryFilters');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const sortSelect = document.getElementById('sortSelect');
const clearFilters = document.getElementById('clearFilters');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

let filteredProducts = [...products];
let cart = [];

function init() {
    // Set up category filters
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" class="category-checkbox" value="${category}"> ${category}
        `;
        categoryFilters.appendChild(label);
    });
    
    loadCart();
    
    displayProducts();
    
    setupEventListeners();
}

function displayProducts() {
    productsGrid.innerHTML = '';
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = '';
      productsCount.textContent = 'No products found';
      return;
    }
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">₹${product.price}</div>
          <div class="product-rating">⭐ ${product.rating}</div>
          <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `;
      productsGrid.appendChild(productCard);
    });
  }
  

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
    const maxPrice = parseInt(priceRange.value);
    const minRating = Array.from(document.querySelectorAll('.rating-checkbox:checked'))
        .map(cb => parseInt(cb.value))
        .sort((a, b) => a - b)[0] || 0;
    
    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price <= maxPrice;
        const ratingMatch = product.rating >= minRating;
        
        return categoryMatch && priceMatch && ratingMatch;
    });
    
    sortProducts();
    displayProducts();
}

function sortProducts() {
    const sortBy = sortSelect.value;
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
            break;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCart();
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        cartTotal.textContent = '₹0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function setupEventListeners() {
    document.querySelectorAll('.category-checkbox').forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });
    
    document.querySelectorAll('.rating-checkbox').forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });
    
    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
        filterProducts();
    });
    
    sortSelect.addEventListener('change', () => {
        sortProducts();
        displayProducts();
    });
    
    clearFilters.addEventListener('click', () => {
        document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.rating-checkbox').forEach(cb => cb.checked = false);
        priceRange.value = 50000;
        priceValue.textContent = '50000';
        sortSelect.value = 'default';
        filterProducts();
    });
    
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    productsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = parseInt(event.target.dataset.id);
            addToCart(productId);
        }
    });
    
    cartItems.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const productId = parseInt(event.target.dataset.id);
            removeFromCart(productId);
        }
        
        if (event.target.classList.contains('quantity-btn')) {
            const productId = parseInt(event.target.dataset.id);
            const action = event.target.dataset.action;
            updateQuantity(productId, action === 'increase' ? 1 : -1);
        }
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your purchase!');
        }
    });
}

init();