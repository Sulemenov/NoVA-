// --- Product Database ---
const products = [
    { id: 1, name: "Neon Hoodie", price: 89, category: "hoodie", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Cyber Tee", price: 45, category: "t-shirt", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Cargo V2", price: 120, category: "hoodie", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Tech Bag", price: 150, category: "accessories", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Oversize Black", price: 55, category: "t-shirt", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop" },
    { id: 6, name: "Utility Vest", price: 95, category: "hoodie", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    initCursor();
    initScrollAnimations();
    loadCart();
});

// --- Render Products ---
const catalogContainer = document.getElementById('catalog');

function renderProducts(items) {
    catalogContainer.innerHTML = '';
    items.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
                <img src="${product.img}" alt="${product.name}" class="product-img" onclick="openModal(${product.id})">            <div class="product-info">
                <div>
                    <h3 class="product-title">${product.name}</h3>
                    <span class="product-price">$${product.price}</span>
                </div>
                <button class="add-btn" onclick="addToCart(${product.id})">ADD +</button>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
    // Re-trigger animations for new elements
    initScrollAnimations();
}

// --- Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        
        if (category === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
        }
    });
});

// --- Cart Logic (LocalStorage) ---
let cart = JSON.parse(localStorage.getItem('novaCart')) || [];

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
    toggleCart(); // Open cart to show item added
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    localStorage.setItem('novaCart', JSON.stringify(cart));
    const cartItemsEl = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    
    cartCountEl.textContent = cart.length;
    
    // Calculate Total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = total;

    // Render Items
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-msg">Your bag is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            cartItemsEl.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="">
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                        <small onclick="removeFromCart(${index})" style="color:red; cursor:pointer;">Remove</small>
                    </div>
                </div>
            `;
        });
    }
}

function loadCart() {
    updateCart();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effect on links/buttons
    const links = document.querySelectorAll('a, button, .product-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            follower.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.borderColor = '#fff';
        });
        link.addEventListener('mouseleave', () => {
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = '#00ff88';
        });
    });
}

// --- Scroll Animations (Intersection Observer) ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => observer.observe(card));
}
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000); // 2 секунды показываем лого
});
// --- Modal Logic ---
const modal = document.getElementById('product-modal');
const closeBtn = document.querySelector('.close-modal');
let currentSelectedSize = null;
let currentProductId = null;

function openModal(id) {
    const product = products.find(p => p.id === id);
    currentProductId = id;

    document.getElementById('modal-img').src = product.img;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = '$' + product.price;

    // Reset sizes
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    currentSelectedSize = null;

    modal.style.display = 'block';
}

// Close Modal
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; }

// Size Selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        currentSelectedSize = this.textContent;
    });
});

// Add to Cart from Modal
document.getElementById('modal-add-btn').addEventListener('click', () => {
    if (!currentSelectedSize) {
        alert("Please select a size!");
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    // Create a unique item with size
    const cartItem = {
        ...product,
        name: `${product.name} (${currentSelectedSize})`, // Append size to name
        selectedSize: currentSelectedSize
    };

    cart.push(cartItem);
    updateCart();
    modal.style.display = 'none';
    toggleCart();
});
// --- Smooth Scroll for Navbar Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- Reveal Text on Scroll (Intersection Observer) ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal-text').forEach(el => revealObserver.observe(el));

// --- Click on Body to scroll down ---
// Сделаем так: если кликнуть по Hero-фону, плавно летим к каталогу
document.querySelector('.hero').addEventListener('click', () => {
    document.querySelector('#catalog').scrollIntoView({ behavior: 'smooth' });
});