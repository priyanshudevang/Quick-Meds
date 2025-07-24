// Loading animation
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loader);

    // Hide loader after page loads
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    });
});

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    class Cart {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('cart')) || [];
            this.modal = document.getElementById('cartModal');
            this.cartItems = document.querySelector('.cart-items');
            this.cartTotal = document.querySelector('.cart-total');
            this.cartCount = document.querySelector('.cart-count');
            this.cartBadge = document.querySelector('.cart-badge');
            
            this.initializeEventListeners();
            this.updateDisplay();
        }

        initializeEventListeners() {
            // Add to cart buttons
            document.querySelectorAll('.medicine-card button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const card = e.target.closest('.medicine-card');
                    const name = card.querySelector('h3 span').textContent;
                    const category = card.querySelector('p.text-gray-500').textContent;
                    const price = parseFloat(card.querySelector('p.text-gray-900').textContent.replace('₹', ''));
                    
                    this.addItem({
                        id: Date.now(),
                        name,
                        category,
                        price,
                        quantity: 1
                    });
                });
            });

            // Cart button click
            document.getElementById('cartButton').addEventListener('click', () => {
                this.showCart();
            });

            // Cart modal close
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideCart();
                }
            });

            // Clear cart button
            document.getElementById('clearCart').addEventListener('click', () => {
                this.clearCart();
            });

            // Checkout button
            document.getElementById('checkout').addEventListener('click', () => {
                this.checkout();
            });

            // Cart items event delegation
            this.cartItems.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;

                const action = button.dataset.action;
                const id = parseInt(button.dataset.id);

                if (action === 'increase') {
                    this.updateQuantity(id, 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(id, -1);
                } else if (action === 'remove') {
                    this.removeItem(id);
                }
            });
        }

        addItem(item) {
            const existingItem = this.items.find(i => i.name === item.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push(item);
            }
            
            this.saveCart();
            this.updateDisplay();
            this.showToast('Item added to cart!', 'success');
        }

        updateQuantity(id, change) {
            const item = this.items.find(i => i.id === id);
            if (item) {
                item.quantity = Math.max(0, item.quantity + change);
                if (item.quantity === 0) {
                    this.removeItem(id);
                } else {
                    this.saveCart();
                    this.updateDisplay();
                }
            }
        }

        removeItem(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveCart();
            this.updateDisplay();
            this.showToast('Item removed from cart', 'info');
        }

        clearCart() {
            if (this.items.length === 0) return;
            
            if (confirm('Are you sure you want to clear your cart?')) {
                this.items = [];
                this.saveCart();
                this.updateDisplay();
                this.showToast('Cart cleared', 'info');
            }
        }

        checkout() {
            if (this.items.length === 0) {
                this.showToast('Your cart is empty!', 'error');
                return;
            }
            
            this.showToast('Proceeding to checkout...', 'success');
            // Add checkout logic here
        }

        showCart() {
            this.modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        hideCart() {
            this.modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        updateDisplay() {
            this.cartItems.innerHTML = '';
            let total = 0;

            this.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.className = 'flex justify-between items-center mb-4';
                itemElement.innerHTML = `
                    <div>
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-sm text-gray-500">${item.category}</p>
                        <p class="text-sm text-gray-600">₹${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="quantity-btn px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200" data-action="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200" data-action="increase" data-id="${item.id}">+</button>
                        <button class="ml-2 text-red-500 hover:text-red-700" data-action="remove" data-id="${item.id}">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                `;
                this.cartItems.appendChild(itemElement);
            });

            this.cartTotal.textContent = `₹${total.toFixed(2)}`;
            const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCount.textContent = `(${itemCount})`;
            this.cartBadge.textContent = itemCount;
        }

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        }

        showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transform transition-transform duration-300 translate-y-0 ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 
                'bg-blue-500'
            } text-white`;
            toast.textContent = message;
            
            setTimeout(() => {
                toast.classList.add('translate-y-[-100%]');
            }, 3000);
        }
    }

    // Initialize cart
    const cart = new Cart();

    // Form submission
    const orderForm = document.querySelector('form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
            notification.textContent = 'Order submitted! Your medicine will arrive in 10 minutes.';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 5000);
            
            orderForm.reset();
        });
    }
});

// Form handling with validation
class OrderForm {
    constructor() {
        this.form = document.querySelector('form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.addInputValidation();
        }
    }

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        let isValid = true;
        let errorMessage = '';

        switch(input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input.value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                isValid = phoneRegex.test(input.value);
                errorMessage = 'Please enter a valid phone number';
                break;
            default:
                isValid = input.value.trim().length > 0;
                errorMessage = 'This field is required';
        }

        this.updateInputStatus(input, isValid, errorMessage);
        return isValid;
    }

    updateInputStatus(input, isValid, errorMessage) {
        input.classList.toggle('error', !isValid);
        
        let errorElement = input.parentElement.querySelector('.error-message');
        if (!isValid) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                input.parentElement.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else if (errorElement) {
            errorElement.remove();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const cart = new Cart();
            cart.showNotification('Order submitted! Your medicine will arrive in 10 minutes.');
            this.form.reset();
        }
    }
}

// Search functionality
class Search {
    constructor() {
        this.init();
    }

    init() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container my-8';
        searchContainer.innerHTML = `
            <input type="text" 
                   class="search-input" 
                   placeholder="Search for medicines..."
                   aria-label="Search medicines">
        `;

        const featuredProducts = document.querySelector('#order-now');
        if (featuredProducts) {
            featuredProducts.parentElement.insertBefore(searchContainer, featuredProducts);
        }

        this.bindSearchEvents(searchContainer.querySelector('input'));
    }

    bindSearchEvents(input) {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const medicineCards = document.querySelectorAll('.medicine-card');

            medicineCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const category = card.querySelector('p.text-gray-500').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();
    new OrderForm();
    new Search();
}); 