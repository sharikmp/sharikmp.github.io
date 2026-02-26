// =========================================
// SHARED UTILITY FUNCTIONS
// =========================================

const STORAGE_KEYS = {
    CART: 'wondertoyz_cart',
    ORDERS: 'wondertoyz_orders',
    PRODUCTS: 'wondertoyz_products'
};

const SETTINGS = {
    showReviewCount: true,
    taxRate: 0.1,
    freeShipping: true,
    mockOTP: '123456'
};

// =========================================
// CART MANAGEMENT
// =========================================

function getCart() {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

function addToCartFromGrid(productId, product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

function updateQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        saveCart(cart);
    }
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

function generateStarsHTML(stars) {
    stars = parseFloat(stars);
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(stars)) {
            starsHTML += '<i class="bi bi-star-fill"></i>';
        } else if (i - stars < 1 && i - stars > 0) {
            starsHTML += '<i class="bi bi-star-half"></i>';
        } else {
            starsHTML += '<i class="bi bi-star"></i>';
        }
    }
    return starsHTML;
}

function getImageUrl(seed) {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&radius=20&backgroundColor=f8f9fa`;
}

function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * SETTINGS.taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
}

// =========================================
// TOAST NOTIFICATIONS
// =========================================

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    
    const icon = type === 'success' ? 'bi-bag-check-fill' : 'bi-exclamation-circle-fill';
    
    toast.innerHTML = `
        <i class="bi ${icon} fs-4"></i>
        <div>
            <strong class="d-block">${message}</strong>
            <span style="font-size: 0.85rem; opacity: 0.9;">The magic is on its way.</span>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeInUp 0.3s ease-in reverse forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// =========================================
// PRODUCT DATA GENERATION
// =========================================

function generateMockProducts() {
    const adjectives = ["Super", "Mega", "Magic", "Bouncy", "Cuddly", "Flying", "Glowing", "Robo", "Mini", "Galactic", "Wobbly", "Fuzzy"];
    const categories = ["Bear", "Car", "Drone", "Blocks", "Puzzle", "Dinosaur", "Unicorn", "Train", "Rocket", "Slime", "Robot", "Bunny"];

    const products = [];
    for (let i = 1; i <= 100; i++) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        products.push({
            id: i,
            name: `${adj} ${category}`,
            price: (Math.random() * (45 - 9) + 9).toFixed(2),
            image: getImageUrl(`WonderToy${i}${Math.random()}`),
            isNew: i < 5,
            reviewStars: (Math.random() * 5).toFixed(1),
            reviewCount: Math.floor(Math.random() * 5000) + 1,
            category: categories[Math.floor(Math.random() * categories.length)]
        });
    }
    
    // Store in sessionStorage for page access (won't persist across browser closes)
    sessionStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products;
}

function getProductById(productId) {
    const productsJson = sessionStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products = productsJson ? JSON.parse(productsJson) : [];
    return products.find(p => p.id === parseInt(productId));
}

function getAllProducts() {
    const productsJson = sessionStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return productsJson ? JSON.parse(productsJson) : [];
}

// =========================================
// ORDER MANAGEMENT
// =========================================

function getOrders() {
    const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
}

function getOrderById(orderId) {
    const orders = getOrders();
    return orders.find(o => o.orderId === orderId);
}

function saveOrder(order) {
    let orders = getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// =========================================
// MASKING UTILITIES
// =========================================

function maskPhone(phone) {
    if (!phone) return '***** ****';
    const cleaned = phone.replace(/\D/g, '');
    const lastFour = cleaned.slice(-4);
    return `****${lastFour}`;
}

function maskEmail(email) {
    if (!email) return '****@example.com';
    const [name, domain] = email.split('@');
    if (name.length <= 2) {
        return `${name[0]}**@${domain}`;
    }
    return `${name[0]}**${name.slice(-1)}@${domain}`;
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
