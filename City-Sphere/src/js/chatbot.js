class Chatbot {
    constructor() {
        this.messages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.setupEventListeners();
        this.responses = {
            greeting: ['Hello! Welcome to City Sphere! How can I assist you today?', 'Hi there! I\'m here to help you with City Sphere services.', 'Welcome! What can I do for you today?'],
            farewell: ['Goodbye! Thank you for using City Sphere!', 'Have a great day! Feel free to come back if you need anything.', 'Take care! Remember, City Sphere is here for all your urban needs!'],
            thanks: ['You\'re welcome! Is there anything else I can help you with?', 'Glad I could help! Don\'t hesitate to ask if you need more assistance.', 'It\'s my pleasure! Let me know if you need anything else.'],
            services: ['City Sphere offers various services including:\n- Emergency Services\n- Transportation Booking\n- Healthcare Services\n- Legal Services\n- Grocery Shopping\nWhat would you like to know more about?'],
            default: ['I\'m not sure I understand. Could you rephrase that?', 'Could you be more specific about what you\'re looking for?', 'I\'m here to help with City Sphere services. Could you clarify your request?']
        };
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });
        this.chatToggle.addEventListener('click', () => this.toggleChat());
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        const icon = this.chatToggle.querySelector('i');
        if (this.chatContainer.classList.contains('active')) {
            icon.className = 'far fa-times-circle';
        } else {
            icon.className = 'far fa-comment-dots';
        }
        if (this.chatContainer.classList.contains('active')) {
            this.userInput.focus();
        }
    }

    handleUserInput() {
        const message = this.userInput.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.userInput.value = '';
            this.processUserInput(message);
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(content);
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    processUserInput(message) {
        // Simulate thinking time
        setTimeout(() => {
            const response = this.generateResponse(message.toLowerCase());
            this.addMessage(response, 'bot');
        }, 500 + Math.random() * 500);
    }

    generateResponse(message) {
        // Check for greetings
        if (this.containsAny(message, ['hi', 'hello', 'hey', 'greetings'])) {
            return this.getRandomResponse('greeting');
        }
        
        // Check for farewells
        if (this.containsAny(message, ['bye', 'goodbye', 'see you', 'farewell'])) {
            return this.getRandomResponse('farewell');
        }
        
        // Check for thanks
        if (this.containsAny(message, ['thank', 'thanks', 'appreciate'])) {
            return this.getRandomResponse('thanks');
        }

        // Check for services related questions
        if (this.containsAny(message, ['service', 'help', 'offer', 'provide'])) {
            return this.getRandomResponse('services');
        }

        // Check for specific service inquiries
        if (this.containsAny(message, ['emergency', 'ambulance', 'police', 'fire'])) {
            return "Our emergency services are available 24/7. You can access them through the Emergency Services section or call directly from our app.";
        }

        if (this.containsAny(message, ['transport', 'bus', 'train', 'metro', 'flight'])) {
            return "We offer comprehensive transportation booking services including bus, train, metro, and flight bookings. Would you like to book a ticket?";
        }

        if (this.containsAny(message, ['doctor', 'medical', 'health', 'hospital'])) {
            return "Our healthcare services include doctor appointments, medical emergencies, and hospital information. Would you like to book an appointment?";
        }

        if (this.containsAny(message, ['lawyer', 'legal', 'law'])) {
            return "Our legal services connect you with experienced lawyers. You can book consultations and get legal advice through our platform.";
        }

        if (this.containsAny(message, ['grocery', 'vegetable', 'food', 'shopping'])) {
            return "We offer convenient grocery shopping services. You can order groceries, vegetables, and daily essentials through our platform.";
        }

        // Default response if no specific patterns are matched
        return this.getRandomResponse('default');
    }

    containsAny(str, items) {
        return items.some(item => str.includes(item));
    }

    getRandomResponse(type) {
        const responses = this.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Create and inject the chat widget HTML
function injectChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <button class="chat-toggle" id="chatToggle" aria-label="Toggle chat">
            <i class="far fa-comment-dots"></i>
        </button>
        <div class="chat-container" id="chatContainer">
            <div class="chat-header">
                <div class="chat-title">
                    <i class="far fa-robot"></i>
                    <h1>Chatty</h1>
                </div>
                <p class="status">Online</p>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    <div class="message-content">
                        <p>Hi! I'm Chatty, your City Sphere assistant. How can I help you today?</p>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="userInput" placeholder="Type your message here..." autocomplete="off">
                <button id="sendButton">
                    <i class="far fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    injectChatWidget();
    new Chatbot();
});
