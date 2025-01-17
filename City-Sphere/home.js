// Redirect functions
function redirectToLogin() {
  window.location.href = "Register-login.html";
}

function redirectToSignUp() {
  window.location.href = "Register-login.html";
  document.getElementById("register-tab").click();
}

// Get elements for Chatbot
const chatbotButton = document.getElementById("chatbot-button");
const chatContainer = document.getElementById("chat-container");
const closeChatButton = document.getElementById("close-chat");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");

// Toggle chat visibility and button text
chatbotButton.addEventListener("click", () => {
  // Toggle visibility of chat container
  chatContainer.classList.toggle("hidden");

  // Change button text based on the state of the chat container
  if (chatContainer.classList.contains("hidden")) {
    chatbotButton.innerHTML = "Chat with AI";
  } else {
    chatbotButton.innerHTML = "Close Chat";
  }
});

//Open and close chatbox

// Close chat when 'X' button is clicked
closeChatButton.addEventListener("click", () => {
  chatContainer.classList.add("hidden");
  chatbotButton.innerHTML = "Chat with AI";
});

// Send message to the AI
function sendMessage() {
  const userMessage = chatInput.value;
  if (userMessage.trim()) {
    chatBox.innerHTML += `<div>User: ${userMessage}</div>`;
    chatInput.value = ""; // Clear input field
    runGeminiAI(userMessage);
  }
}

// Gemini AI Integration (Assuming you have your API key and required library set up)
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyCsEYM772Kc3u1i5F-tpvPinpbGKIJgV2sY"; // Keep this private
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runGeminiAI(userInput) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(userInput);
    chatBox.innerHTML += `<div>AI: ${result.response.text()}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
  } catch (error) {
    console.error("Error with Gemini AI:", error);
  }
}

// Google Maps initialization
let map, autocomplete;

function initMap() {
  const defaultLocation = { lat: 18.5204, lng: 73.8567 }; // Pune coordinates

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  // Initialize autocomplete for search
  const input = document.getElementById("pac-input");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Place a marker on selected location
      new google.maps.Marker({
        position: place.geometry.location,
        map: map,
      });
    }
  });
}
