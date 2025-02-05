class Chatty {
    constructor() {
        this.isOpen = false;
        this.initializeChat();
        this.responses = {
            "hello": "Hi there! How can I help you today?",
            "hi": "Hello! What can I do for you?",
            "how are you": "I'm doing great, thanks for asking! How can I assist you?",
            "bye": "Goodbye! Have a great day!",
            "default": "I'm not sure about that. Could you please rephrase your question?",
            "services": "We offer a wide range of services. Here are some examples:\n\n- Home services\n- Transportation booking\n- Grocery and fresh produce ordering\n- Medicine delivery\n- Contact and support"
        };
    }

    initializeChat() {
        // Create chat button
        const button = document.createElement('button');
        button.className = 'chat-button';
        button.innerHTML = '<i class="fas fa-comments"></i>';
        button.onclick = () => this.toggleChat();

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <span>Chatty</span>
                <button class="close-chat">&times;</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message...">
                <button class="send-button">Send</button>
            </div>
        `;

        // Create container and append elements
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.appendChild(chatWindow);
        container.appendChild(button);
        document.body.appendChild(container);

        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeButton = document.querySelector('.close-chat');
        const sendButton = document.querySelector('.send-button');
        const input = document.querySelector('.chat-input input');

        closeButton.onclick = () => this.toggleChat();
        sendButton.onclick = () => this.sendMessage();
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        };
    }

    toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.style.display = this.isOpen ? 'flex' : 'none';

        if (this.isOpen && document.querySelector('.chat-messages').children.length === 0) {
            this.addMessage("Hi! I'm Chatty. How can I help you today?", 'bot');
        }
    }

    sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();

        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const response = this.getBotResponse(message.toLowerCase());
                this.addMessage(response, 'bot');
            }, 500);
        }
    }

    addMessage(text, sender) {
        const messagesDiv = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    getBotResponse(message) {
        for (let key in this.responses) {
            if (message.includes(key)) {
                return this.responses[key];
            }
        }
        return this.responses.default;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatty();
});
