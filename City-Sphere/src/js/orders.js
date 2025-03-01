document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    loadOrders();

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'auth.html';
    });
});

async function loadOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/restaurants/orders/my', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        alert('Failed to load orders');
    }
}

function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    orders.forEach(order => {
        const orderElement = createOrderElement(order);
        container.appendChild(orderElement);
    });
}

function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-card';

    const orderDate = new Date(order.orderDate);
    const timeDiff = Date.now() - orderDate.getTime();
    const canCancel = timeDiff <= 60000; // 60 seconds

    orderDiv.innerHTML = `
        <div class="order-header">
            <div class="order-restaurant">${order.restaurantName}</div>
            <div class="order-status status-${order.status.toLowerCase()}">${order.status}</div>
        </div>
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-summary">
            <div>Subtotal: ₹${order.subtotal.toFixed(2)}</div>
            <div>Tax (${order.taxRate}%): ₹${order.taxAmount.toFixed(2)}</div>
            <div><strong>Total: ₹${order.totalAmount.toFixed(2)}</strong></div>
        </div>
        ${canCancel ? `
            <button class="cancel-button" onclick="cancelOrder('${order._id}')">
                Cancel Order
                <span class="timer">${Math.ceil((60000 - timeDiff) / 1000)}s</span>
            </button>
        ` : ''}
    `;

    if (canCancel) {
        startTimer(orderDiv.querySelector('.timer'), order._id);
    }

    return orderDiv;
}

function startTimer(timerElement, orderId) {
    const interval = setInterval(() => {
        const seconds = parseInt(timerElement.textContent);
        if (seconds <= 1) {
            clearInterval(interval);
            const button = timerElement.parentElement;
            button.disabled = true;
            button.textContent = 'Cannot cancel now';
        } else {
            timerElement.textContent = `${seconds - 1}s`;
        }
    }, 1000);
}

async function cancelOrder(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/restaurants/order/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel order');
        }

        alert('Order cancelled successfully');
        loadOrders(); // Reload orders
    } catch (error) {
        console.error('Error cancelling order:', error);
        alert(error.message);
    }
} 