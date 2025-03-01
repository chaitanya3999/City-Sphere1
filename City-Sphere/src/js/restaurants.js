document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    // Restaurant data
    const staticRestaurants = [
        {
            name: "Spice Garden",
            cuisine: ["Indian", "Chinese"],
            rating: 4.5,
            location: "MG Road",
            distance: 2.5,
            priceForTwo: 300,
            taxRate: 18,
            image: "../images/Restaurant 1 Image.jpeg",
            menu: [
                {
                    name: "Chicken Kolhapuri",
                    price: 280,
                    description: "Spicy curry with tender chicken pieces",
                    category: "Main Course"
                },
                {
                    name: "Dal Makhani",
                    price: 180,
                    description: "Black lentils cooked overnight with cream",
                    category: "Main Course"
                },
                {
                    name: "Butter Garlic Naan",
                    price: 80,
                    description: "Traditional Indian bread",
                    category: "Breads"
                }
            ]
        },
        {
            name: "Pizza Paradise",
            cuisine: ["Italian", "Fast Food"],
            rating: 4.2,
            location: "Brigade Road",
            distance: 1.8,
            priceForTwo: 400,
            taxRate: 12,
            image: "../images/Restaurant 2 Image.jpg",
            menu: [
                {
                    name: "Margherita Pizza",
                    price: 199,
                    description: "Classic pizza with tomato and mozzarella",
                    category: "Pizza"
                },
                {
                    name: "Pepperoni Pizza",
                    price: 299,
                    description: "Pizza topped with spicy chicken pepperoni",
                    category: "Pizza"
                },
                {
                    name: "Garlic Bread",
                    price: 99,
                    description: "Freshly baked bread with garlic butter",
                    category: "Sides"
                }
            ]
        },
        {
            name: "McDonald's",
            cuisine: ["Fast Food", "American"],
            rating: 4.0,
            location: "Koramangala",
            distance: 3.0,
            priceForTwo: 500,
            taxRate: 5,
            image: "../images/Restaurant 3 Image.jpeg",
            menu: [
                {
                    name: "McChicken Burger",
                    price: 150,
                    description: "Classic chicken burger with lettuce and mayo",
                    category: "Burgers"
                },
                {
                    name: "French Fries",
                    price: 99,
                    description: "Crispy golden fries",
                    category: "Sides"
                },
                {
                    name: "Coke",
                    price: 60,
                    description: "Refreshing cola drink",
                    category: "Beverages"
                }
            ]
        }
    ];

    // Display restaurants
    function displayRestaurants(restaurants) {
        const grid = document.querySelector('.restaurants-grid');
        if (!grid) return;

        grid.innerHTML = '';
        restaurants.forEach(restaurant => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            
            card.innerHTML = `
                <div class="restaurant-image">
                    <img src="${restaurant.image}" alt="${restaurant.name}">
                    <span class="rating"><i class="fas fa-star"></i> ${restaurant.rating}</span>
                </div>
                <div class="restaurant-info">
                    <h3>${restaurant.name}</h3>
                    <p class="cuisine">${restaurant.cuisine.join(', ')}</p>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${restaurant.distance} km away</p>
                    <div class="restaurant-footer">
                        <span class="price">₹${restaurant.priceForTwo} for two</span>
                        <button class="btn-order">Order Now</button>
                    </div>
                </div>
            `;

            const orderBtn = card.querySelector('.btn-order');
            orderBtn.addEventListener('click', () => openOrderModal(restaurant));

            grid.appendChild(card);
        });
    }

    // Wallet check function
    async function getWalletBalance() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to continue');
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/wallet', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to check wallet balance');
            }

            const data = await response.json();
            if (typeof data.balance !== 'number') {
                throw new Error('Invalid wallet balance received');
            }

            return data.balance;
        } catch (error) {
            console.error('Wallet error:', error);
            throw new Error('Failed to check wallet balance. Please try again.');
        }
    }

    // Update the order handler
    async function handleOrder(modal, restaurant) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to place order');
                window.location.href = 'auth.html';
                return;
            }

            const { items, subtotal, tax, total } = updateOrderSummary(modal, restaurant);
            
            if (!items.some(item => item.quantity > 0)) {
                alert('Please select at least one item');
                return;
            }

            // First verify wallet balance
            const walletResponse = await fetch('http://localhost:5000/api/wallet/balance', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!walletResponse.ok) {
                const error = await walletResponse.json();
                throw new Error(error.message || 'Failed to verify wallet balance');
            }

            const walletData = await walletResponse.json();
            if (walletData.balance < total) {
                alert(`Insufficient balance. Need ₹${total} but have ₹${walletData.balance}`);
                window.location.href = 'wallet.html';
                return;
            }

            // Deduct payment first
            const paymentResponse = await fetch('http://localhost:5000/api/wallet/deduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: total,
                    description: `Payment for order at ${restaurant.name}`
                })
            });

            if (!paymentResponse.ok) {
                const error = await paymentResponse.json();
                throw new Error(error.message || 'Payment failed');
            }

            // Then place the order
            const orderResponse = await fetch('http://localhost:5000/api/restaurants/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    restaurantName: restaurant.name,
                    items: items.filter(item => item.quantity > 0).map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    subtotal,
                    taxRate: restaurant.taxRate,
                    taxAmount: tax,
                    totalAmount: total,
                    specialInstructions: modal.querySelector('#special-instructions')?.value || ''
                })
            });

            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                // If order fails, refund the payment
                await fetch('http://localhost:5000/api/wallet/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount: total,
                        description: `Refund for failed order at ${restaurant.name}`
                    })
                });
                throw new Error(orderData.message || 'Failed to place order');
            }

            alert('Order placed successfully!');
            modal.remove();
            window.location.href = 'orders.html';
        } catch (error) {
            console.error('Order error:', error);
            alert(error.message);
        }
    }

    // Update modal creation
    function openOrderModal(restaurant) {
        const modal = document.createElement('div');
        modal.className = 'menu-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${restaurant.name} - Menu</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="menu-items">
                    ${restaurant.menu.map(item => `
                        <div class="menu-item" data-price="${item.price}">
                            <div class="item-info">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                                <span class="price">₹${item.price}</span>
                            </div>
                            <div class="item-actions">
                                <button class="quantity-btn minus">-</button>
                                <span class="quantity">0</span>
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-summary">
                    <div class="subtotal">Subtotal: ₹0.00</div>
                    <div class="tax">Tax (${restaurant.taxRate}%): ₹0.00</div>
                    <div class="total">Total: ₹0.00</div>
                </div>
                <button class="place-order-btn">Place Order</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        const placeOrderBtn = modal.querySelector('.place-order-btn');
        const quantityBtns = modal.querySelectorAll('.quantity-btn');

        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.remove();
        });

        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.menu-item');
                const quantityEl = item.querySelector('.quantity');
                let quantity = parseInt(quantityEl.textContent);

                if (btn.classList.contains('plus')) {
                    quantity++;
                } else if (btn.classList.contains('minus') && quantity > 0) {
                    quantity--;
                }

                quantityEl.textContent = quantity;
                updateOrderSummary(modal, restaurant);
            });
        });

        placeOrderBtn.addEventListener('click', () => handleOrder(modal, restaurant));
    }

    // Update order summary
    function updateOrderSummary(modal, restaurant) {
        const items = Array.from(modal.querySelectorAll('.menu-item')).map(item => ({
            name: item.querySelector('h3').textContent,
            price: parseFloat(item.dataset.price),
            quantity: parseInt(item.querySelector('.quantity').textContent)
        }));

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = (subtotal * restaurant.taxRate) / 100;
        const total = subtotal + tax;

        modal.querySelector('.subtotal').textContent = `Subtotal: ₹${subtotal.toFixed(2)}`;
        modal.querySelector('.tax').textContent = `Tax (${restaurant.taxRate}%): ₹${tax.toFixed(2)}`;
        modal.querySelector('.total').textContent = `Total: ₹${total.toFixed(2)}`;

        return { items, subtotal, tax, total };
    }

    // Initialize
    displayRestaurants(staticRestaurants);

    // Search and filter functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filtered = staticRestaurants.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm))
            );
            displayRestaurants(filtered);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const cuisine = button.textContent.trim();
                const filtered = cuisine === 'All' 
                    ? staticRestaurants 
                    : staticRestaurants.filter(r => r.cuisine.includes(cuisine));
                displayRestaurants(filtered);
            });
        });
    }
});